/**
 * Crawl a local production build and fail when an internal link, image,
 * sample PDF, og:image, canonical, or hreflang URL 404s or redirects.
 *
 * `npm test` runs this after the unit tests. With no LINK_CHECK_BASE, the
 * script builds (unless LINK_CHECK_SKIP_BUILD=1 and .next already exists)
 * and starts `next start` itself.
 *
 * The request user agent is a normal browser. A bot user agent would hide
 * locale redirects, because crawlers are rewritten instead of redirected.
 *
 * Usage:
 *   node scripts/check-internal-links.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const root = process.cwd();
const port = process.env.LINK_CHECK_PORT || "43991";
const givenBase = (process.argv[2] || process.env.LINK_CHECK_BASE || "").replace(/\/$/, "");
const skipBuild = process.env.LINK_CHECK_SKIP_BUILD === "1";
const siteHosts = new Set(["getvellumpress.com", "www.getvellumpress.com"]);
const browserUa =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const problems = [];
const checked = new Map();
const crawled = new Set();

function note(message) {
  problems.push(message);
}

function srcsetUrls(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function parseAttrs(source) {
  const attrs = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(re)) {
    const name = match[1].toLowerCase();
    attrs[name] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attrs;
}

function toLocal(raw, base, pageUrl) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:") ||
    lower.startsWith("sms:") ||
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("blob:")
  ) {
    return null;
  }
  let url;
  try {
    url = new URL(trimmed, pageUrl || base);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  const local = new URL(base);
  if (host !== local.hostname.toLowerCase() && !siteHosts.has(host)) return null;
  url.protocol = local.protocol;
  url.hostname = local.hostname;
  url.port = local.port;
  url.hash = "";
  return url.toString();
}

function walkJson(value, found) {
  if (typeof value === "string") {
    found.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walkJson(item, found);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) walkJson(item, found);
  }
}

function collect(html, pageUrl, base) {
  const found = [];
  const add = (raw, kind) => {
    const local = toLocal(raw, base, pageUrl);
    if (!local) return;
    const pathName = new URL(local).pathname;
    let nextKind = kind;
    if (pathName.startsWith("/samples/") && pathName.endsWith(".pdf")) nextKind = "sample";
    found.push({ url: local, kind: nextKind });
  };

  const tagRe = /<(a|img|source|link|script|meta|area|video|audio)\b([^>]*)>/gi;
  for (const match of html.matchAll(tagRe)) {
    const tag = match[1].toLowerCase();
    const attrs = parseAttrs(match[2]);
    if (tag === "a" || tag === "area") add(attrs.href, "link");
    if (tag === "img") {
      add(attrs.src, "image");
      for (const item of srcsetUrls(attrs.srcset)) add(item, "image");
    }
    if (tag === "source") {
      add(attrs.src, "image");
      for (const item of srcsetUrls(attrs.srcset)) add(item, "image");
    }
    if (tag === "video" || tag === "audio") {
      add(attrs.src, "link");
      add(attrs.poster, "image");
    }
    if (tag === "script" && attrs.src) add(attrs.src, "script");
    if (tag === "link") {
      const rel = (attrs.rel || "").toLowerCase();
      if (/\bcanonical\b/.test(rel)) add(attrs.href, "canonical");
      else if (/\balternate\b/.test(rel)) add(attrs.href, "hreflang");
      else if (attrs.as === "image") add(attrs.href, "image");
      else add(attrs.href, "asset");
    }
    if (tag === "meta") {
      const prop = (attrs.property || attrs.name || "").toLowerCase();
      if (prop === "og:image" || prop === "og:image:url" || prop === "og:image:secure_url" || prop === "twitter:image") {
        add(attrs.content, "og:image");
      } else if (prop === "og:url") add(attrs.content, "canonical");
      else if (prop === "refresh" || (attrs["http-equiv"] || "").toLowerCase() === "refresh") {
        const target = (attrs.content || "").split(/;\s*url=/i)[1];
        if (target) note(`${pageUrl} meta refresh to ${target}`);
      }
    }
  }

  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(scriptRe)) {
    const attrs = parseAttrs(match[1]);
    const type = (attrs.type || "").toLowerCase();
    if (!type.includes("ld+json")) continue;
    try {
      const data = JSON.parse(match[2]);
      const strings = [];
      walkJson(data, strings);
      for (const value of strings) add(value, "link");
    } catch {
      note(`${pageUrl} has invalid JSON-LD`);
    }
  }

  return found;
}

function publicSeeds() {
  const urls = ["/logo.png"];
  const samplesDir = path.join(root, "public", "samples");
  if (existsSync(samplesDir)) {
    for (const file of readdirSync(samplesDir)) {
      if (file.endsWith(".pdf")) urls.push(`/samples/${file}`);
    }
  }
  const previewDir = path.join(root, "public", "previews");
  if (existsSync(previewDir)) {
    for (const file of readdirSync(previewDir)) {
      if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".webp")) urls.push(`/previews/${file}`);
    }
  }
  return urls;
}

function titleOf(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : "";
}

function isSoftNotFound(html) {
  const title = titleOf(html);
  return title.includes("Page Not Found") || title.includes("الصفحة غير موجودة");
}

async function request(url) {
  const response = await fetch(url, {
    redirect: "manual",
    headers: {
      "user-agent": browserUa,
      "accept-language": "en",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/png,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(45000),
  });
  const status = response.status;
  const location = response.headers.get("location");
  const type = response.headers.get("content-type") || "";
  let body = "";
  if (status >= 200 && status < 300 && /text\/html|xml|text\/plain|json/.test(type)) {
    body = await response.text();
  } else {
    await response.body?.cancel();
  }
  return { status, location, type, body };
}

function shouldCrawl(url, type, body) {
  const pathName = new URL(url).pathname;
  if (pathName.startsWith("/_next/")) return false;
  if (pathName.startsWith("/samples/") || pathName.startsWith("/previews/")) return false;
  if (/\/opengraph-image/.test(pathName) || /\/twitter-image/.test(pathName)) return false;
  if (/\.(?:png|jpe?g|webp|gif|svg|pdf|ico|woff2?|css|js|map|txt|xml)$/i.test(pathName)) {
    return pathName.endsWith("/sitemap.xml") || pathName.endsWith("/robots.txt");
  }
  if (type.includes("text/html") || type.includes("xml") || body.trimStart().startsWith("<")) return true;
  return false;
}

async function pool(items, limit, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(runners);
}

async function checkUrl(base, entry) {
  if (checked.has(entry.url)) return;
  checked.set(entry.url, entry.from || "");
  let result;
  try {
    result = await request(entry.url);
  } catch (error) {
    note(`${entry.kind} ${entry.url} failed to load (${error instanceof Error ? error.name : "error"}) from ${entry.from || "seed"}`);
    return;
  }
  if (entry.expect === 404) {
    if (result.status !== 404) note(`missing page ${entry.url} returned ${result.status}, expected 404`);
  } else if (result.status >= 300 && result.status < 400) {
    note(`${entry.kind} ${result.status} ${entry.url} -> ${result.location || "(no location)"} from ${entry.from || "seed"}`);
    return;
  } else if (result.status < 200 || result.status >= 300) {
    note(`${entry.kind} ${result.status} ${entry.url} from ${entry.from || "seed"}`);
    return;
  } else if (entry.expect !== 404 && isSoftNotFound(result.body) && !entry.url.endsWith("/404")) {
    note(`${entry.kind} ${entry.url} returned the not-found page with HTTP 200 from ${entry.from || "seed"}`);
  }
  if (/Application error|Unhandled Runtime Error|server component error/i.test(result.body)) {
    note(`${entry.url} rendered an application error`);
  }
  if (!shouldCrawl(entry.url, result.type, result.body) || crawled.has(entry.url)) return;
  crawled.add(entry.url);
  const discovered = [];
  if (new URL(entry.url).pathname.endsWith("/sitemap.xml") || result.type.includes("xml")) {
    for (const match of result.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
      const local = toLocal(match[1], base, entry.url);
      if (local) discovered.push({ url: local, kind: "link", from: entry.url });
    }
  }
  if (result.type.includes("html") || result.body.trimStart().startsWith("<!DOCTYPE") || result.body.includes("<html")) {
    for (const item of collect(result.body, entry.url, base)) {
      discovered.push({ url: item.url, kind: item.kind, from: entry.url });
    }
  }
  await pool(discovered, 6, (item) => checkUrl(base, item));
}

function runBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build"], {
      cwd: root,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`next build exited ${code}`));
    });
  });
}

function startServer() {
  const child = spawn(
    process.execPath,
    [path.join(root, "node_modules/next/dist/bin/next"), "start", "-H", "127.0.0.1", "-p", port],
    { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
  );
  let log = "";
  const write = (chunk, stream) => {
    const text = chunk.toString();
    log += text;
    stream.write(text);
  };
  child.stdout.on("data", (chunk) => write(chunk, process.stdout));
  child.stderr.on("data", (chunk) => write(chunk, process.stderr));
  return { child, readLog: () => log };
}

async function waitUntilReady(base, child) {
  const deadline = Date.now() + 60000;
  let last = "";
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`next start exited ${child.exitCode} before it was ready`);
    try {
      const result = await request(`${base}/en`);
      if (result.status === 200) return;
      last = String(result.status);
    } catch (error) {
      last = error instanceof Error ? error.message : "connection refused";
    }
    await delay(300);
  }
  throw new Error(`production server did not become ready (${last})`);
}

async function main() {
  let child = null;
  let readLog = () => "";
  let base = givenBase;
  try {
    if (!base) {
      if (!(skipBuild && existsSync(path.join(root, ".next", "BUILD_ID")))) {
        console.log("Building the production app for the link check…");
        await runBuild();
      }
      const started = startServer();
      child = started.child;
      readLog = started.readLog;
      base = `http://127.0.0.1:${port}`;
      await waitUntilReady(base, child);
    }

    const seeds = [
      { url: `${base}/sitemap.xml`, kind: "link", from: "seed" },
      { url: `${base}/robots.txt`, kind: "link", from: "seed" },
      { url: `${base}/en`, kind: "link", from: "seed" },
      { url: `${base}/ar`, kind: "link", from: "seed" },
      { url: `${base}/en/this-page-is-not-real`, kind: "link", from: "404 probe", expect: 404 },
      { url: `${base}/ar/this-page-is-not-real`, kind: "link", from: "404 probe", expect: 404 },
      ...publicSeeds().map((href) => ({ url: `${base}${href}`, kind: href.includes("/samples/") ? "sample" : "image", from: "public" })),
    ];
    await pool(seeds, 4, (entry) => checkUrl(base, entry));

    const log = readLog();
    const errorLines = log
      .split("\n")
      .filter((line) => /⨯|ECONN|TypeError|ReferenceError|Unhandled|Application error/.test(line))
      .slice(0, 20);
    for (const line of errorLines) note(`server log: ${line.trim()}`);

    if (crawled.size < 10) note(`only crawled ${crawled.size} pages`);

    if (problems.length) {
      console.error(`\n${problems.length} internal link problem${problems.length === 1 ? "" : "s"}:`);
      for (const problem of problems) console.error(`- ${problem}`);
      console.error(`Checked ${checked.size} URLs, crawled ${crawled.size} pages.`);
      process.exitCode = 1;
      return;
    }
    console.log(`Internal links ok. Checked ${checked.size} URLs, crawled ${crawled.size} pages.`);
  } finally {
    if (child && child.exitCode === null) {
      child.kill("SIGTERM");
      await delay(500);
      if (child.exitCode === null) child.kill("SIGKILL");
    }
  }
}

await main();
