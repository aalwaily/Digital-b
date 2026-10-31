/**
 * Visit every sitemap URL in Arabic and English and fail when the rendered
 * page points at something broken.
 *
 * Checks, against a local production server:
 * - internal <a href> answers 200, or one intentional 301/308 that lands on 200
 * - links to the old /products path fail (they must point at the shop)
 * - internal images, fonts, scripts, stylesheets, Open Graph images, favicons,
 *   and manifests answer 200
 * - sample PDFs and preview images referenced on the page exist
 * - the canonical URL is that page's own language version and answers 200
 * - hreflang alternates (the languages the page actually publishes, plus
 *   x-default) match the sitemap, point back, and answer 200
 * - external links are well-formed https URLs and are not requested
 * - mailto addresses are glarz.com@gmail.com; WhatsApp links are well-formed https
 *
 * A journal article that exists in only one language publishes that language
 * and x-default. It does not advertise the missing translation.
 *
 * Usage:
 *   npm run links
 *   npm run links -- http://127.0.0.1:43123
 *   LINK_CHECK_BASE=http://127.0.0.1:43123 npm run links
 *
 * With no base URL, the script builds (unless LINK_CHECK_SKIP_BUILD=1 and
 * .next already exists) and starts `next start` itself.
 *
 * The browser user agent matters. A bot user agent would hide locale redirects,
 * because crawlers are rewritten instead of redirected.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import {
  alternateTarget,
  assetTypeIssue,
  canonicalIssue,
  classifyReference,
  collectDocument,
  CONTACT_EMAIL,
  cssUrls,
  hreflangClusterIssues,
  hreflangMismatch,
  kindForPath,
  localeOf,
  mailtoIssue,
  normalizePath,
  parseSitemap,
  permanentRedirect,
  sampleForPreview,
  underlyingPublicPath,
  whatsAppIssue,
} from "./link-rules.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.LINK_CHECK_PORT || "43991";
const givenBase = (process.argv[2] || process.env.LINK_CHECK_BASE || "").replace(/\/$/, "");
const skipBuild = process.env.LINK_CHECK_SKIP_BUILD === "1";
const browserUa =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const problems = new Set();
const responses = new Map();
const parsedPaths = new Set();
const pageInfo = new Map();
const counts = {
  pages: 0,
  en: 0,
  ar: 0,
  links: 0,
  redirects: 0,
  assets: 0,
  external: 0,
  mailto: 0,
  whatsapp: 0,
};

function note(message) {
  problems.add(message);
}

function display(url) {
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}`;
}

async function requestOnce(url) {
  const response = await fetch(url, {
    redirect: "manual",
    headers: {
      "user-agent": browserUa,
      "accept-language": "en",
      accept: "*/*",
    },
    signal: AbortSignal.timeout(60000),
  });
  const status = response.status;
  const location = response.headers.get("location");
  const type = response.headers.get("content-type") || "";
  const readable = /text\/html|application\/xhtml|text\/css|[/+]xml|application\/xml|text\/xml/.test(type);
  let body = "";
  if (readable && status >= 200 && status < 400) body = await response.text();
  else await response.body?.cancel();
  return { status, location, type, body };
}

async function getResponse(url) {
  const existing = responses.get(url);
  if (existing) return existing;
  const pending = (async () => {
    let last;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await requestOnce(url);
      } catch (error) {
        last = error;
        await delay(250);
      }
    }
    throw last;
  })();
  responses.set(url, pending);
  return pending;
}

function locationUrl(location, from, base) {
  if (!location) return null;
  const classified = classifyReference(location, from, base);
  if (classified.kind !== "internal") return null;
  return classified.localUrl;
}

const pending = [];
const seen = new Set();
let active = 0;
const waiters = [];
const limit = 6;

function notify() {
  if (active !== 0 || pending.length !== 0) return;
  while (waiters.length) waiters.shift()();
}

function kick() {
  while (active < limit && pending.length) {
    const task = pending.shift();
    active += 1;
    runTask(task)
      .catch((error) => {
        note(`${task.url} crashed the checker (${error instanceof Error ? error.message : "error"})`);
      })
      .finally(() => {
        active -= 1;
        kick();
        notify();
      });
  }
}

function enqueue(task) {
  const key = `${task.role}|${task.url}`;
  if (seen.has(key)) return;
  seen.add(key);
  pending.push(task);
  kick();
}

function drain() {
  if (active === 0 && pending.length === 0) return Promise.resolve();
  return new Promise((resolve) => {
    waiters.push(resolve);
    notify();
  });
}

function considerSample(localUrl, from, base) {
  const inner = underlyingPublicPath(localUrl);
  const sample = sampleForPreview(inner);
  if (!sample) return;
  const sampleUrl = new URL(sample, base).toString();
  enqueue({ role: "asset", url: sampleUrl, kind: "download", from, base });
  if (inner !== new URL(localUrl).pathname) {
    enqueue({ role: "asset", url: new URL(inner, base).toString(), kind: "preview", from, base });
  }
}

const ASSET_KINDS = new Set([
  "download",
  "preview",
  "image",
  "font",
  "script",
  "stylesheet",
  "og:image",
  "favicon",
  "manifest",
]);

function enqueueReference(raw, hint, from, base, { anchor = false } = {}) {
  const classified = classifyReference(raw, from, base);
  if (classified.kind === "skip") return;
  if (classified.kind === "bad") {
    note(`${display(from)} ${classified.issue}`);
    return;
  }
  if (classified.kind === "mailto") {
    counts.mailto += 1;
    const issue = mailtoIssue(classified.href);
    if (issue) note(`${display(from)} ${issue}`);
    return;
  }
  if (classified.kind === "whatsapp") {
    counts.whatsapp += 1;
    const issue = whatsAppIssue(classified.href);
    if (issue) note(`${display(from)} ${issue}: ${classified.href}`);
    return;
  }
  if (classified.kind === "external") {
    counts.external += 1;
    return;
  }
  if (anchor) counts.links += 1;
  const kind = kindForPath(classified.path, hint);
  if (ASSET_KINDS.has(kind)) {
    enqueue({ role: "asset", url: classified.localUrl, kind, from, base });
    if (kind === "preview" || kind === "image") considerSample(classified.localUrl, from, base);
    return;
  }
  enqueue({ role: "internal", url: classified.localUrl, kind: "link", from, base });
}

function rememberPage(url, collected, base) {
  const path = normalizePath(new URL(url).pathname);
  const hreflang = {};
  for (const [lang, href] of Object.entries(collected.hreflang)) {
    const target = alternateTarget(href, url, base);
    if (target.issue) {
      note(`${path} ${target.issue}`);
      continue;
    }
    hreflang[lang] = target.path;
    enqueue({ role: "final", url: target.localUrl, kind: "hreflang", from: url, base });
  }
  pageInfo.set(path, { hreflang, noindex: collected.robotsNoindex });
}

async function parsePage(url, body, base, { sitemap }) {
  const path = normalizePath(new URL(url).pathname);
  if (parsedPaths.has(path)) return;
  parsedPaths.add(path);
  const collected = collectDocument(body);
  if (collected.softNotFound) note(`${path} returned the not-found page with HTTP 200`);
  if (collected.appError) note(`${path} rendered an application error`);
  if (collected.jsonLdInvalid) note(`${path} has invalid JSON-LD`);
  for (const email of collected.emails) {
    if (email.toLowerCase() !== CONTACT_EMAIL) {
      note(`${path} JSON-LD email must be ${CONTACT_EMAIL}, found ${email}`);
    }
  }

  const requireCanonical = sitemap || localeOf(path);
  if (sitemap && collected.robotsNoindex) note(`${path} is in the sitemap but marked noindex`);
  if (requireCanonical && collected.canonicals.length === 0) note(`${path} is missing a canonical URL`);
  const canonicalPaths = new Set();
  for (const href of collected.canonicals) {
    const issue = canonicalIssue(url, href, base);
    if (issue) note(`${path} ${issue}`);
    const classified = classifyReference(href, url, base);
    if (classified.kind === "internal") {
      canonicalPaths.add(classified.path);
      enqueue({ role: "final", url: classified.localUrl, kind: "canonical", from: url, base });
    }
  }
  if (canonicalPaths.size > 1) note(`${path} declares more than one canonical (${[...canonicalPaths].join(", ")})`);
  if (collected.ogUrl) {
    const issue = canonicalIssue(url, collected.ogUrl, base);
    if (issue) note(`${path} og:url ${issue.replace(/^canonical /, "")}`);
  }

  rememberPage(url, collected, base);
  for (const href of collected.anchors) enqueueReference(href, "link", url, base, { anchor: true });
  for (const ref of collected.refs) {
    const hint = ref.kind === "jsonld" ? "link" : ref.kind;
    enqueueReference(ref.raw, hint, url, base);
  }
}

async function checkFinal(task) {
  let result;
  try {
    result = await getResponse(task.url);
  } catch (error) {
    note(`${task.kind} ${display(task.url)} failed to load (${error instanceof Error ? error.name : "error"}) from ${display(task.from)}`);
    return;
  }
  if (result.status !== 200) {
    const where = permanentRedirect(result.status) ? ` redirected to ${result.location || "(no location)"}` : "";
    note(`${task.kind} ${display(task.url)} returned ${result.status}${where} from ${display(task.from)}`);
    return;
  }
  if (collectedSoft(result)) note(`${task.kind} ${display(task.url)} returned the not-found page from ${display(task.from)}`);
}

function collectedSoft(result) {
  return /text\/html/.test(result.type) && result.body && result.body.includes("<title") && /Page Not Found|الصفحة غير موجودة/.test(result.body);
}

async function checkAsset(task) {
  counts.assets += 1;
  let result;
  try {
    result = await getResponse(task.url);
  } catch (error) {
    note(`${task.kind} ${display(task.url)} failed to load (${error instanceof Error ? error.name : "error"}) from ${display(task.from)}`);
    return;
  }
  let final = result;
  let finalUrl = task.url;
  if (permanentRedirect(result.status)) {
    const next = locationUrl(result.location, task.url, task.base);
    if (!next) {
      note(`${task.kind} ${display(task.url)} redirected off-site from ${display(task.from)}`);
      return;
    }
    try {
      final = await getResponse(next);
    } catch (error) {
      note(`${task.kind} ${display(next)} failed to load after ${result.status} (${error instanceof Error ? error.name : "error"})`);
      return;
    }
    if (permanentRedirect(final.status)) {
      note(`${task.kind} ${display(task.url)} redirected more than once from ${display(task.from)}`);
      return;
    }
    finalUrl = next;
  }
  if (final.status !== 200) {
    note(`${task.kind} ${final.status} ${display(task.url)} from ${display(task.from)}`);
    return;
  }
  const typeIssue = assetTypeIssue(task.kind, final.type);
  if (typeIssue) note(`${task.kind} ${display(finalUrl)} ${typeIssue} from ${display(task.from)}`);
  if (task.kind === "stylesheet" && final.body) {
    for (const raw of cssUrls(final.body)) enqueueReference(raw, "asset", finalUrl, task.base);
  }
  if (task.kind === "preview" || task.kind === "image") considerSample(finalUrl, task.from, task.base);
}

async function checkInternal(task) {
  let result;
  try {
    result = await getResponse(task.url);
  } catch (error) {
    note(`link ${display(task.url)} failed to load (${error instanceof Error ? error.name : "error"}) from ${display(task.from)}`);
    return;
  }
  if (result.status >= 200 && result.status < 300) {
    if (collectedSoft(result)) note(`link ${display(task.url)} returned the not-found page with HTTP ${result.status} from ${display(task.from)}`);
    if (result.status !== 200) note(`link ${display(task.url)} returned ${result.status} from ${display(task.from)}`);
    await maybeParse(task.url, result, task.base);
    return;
  }
  if (permanentRedirect(result.status)) {
    const next = locationUrl(result.location, task.url, task.base);
    if (!next) {
      note(`link ${result.status} ${display(task.url)} redirected off-site from ${display(task.from)}`);
      return;
    }
    let second;
    try {
      second = await getResponse(next);
    } catch (error) {
      note(`link ${display(next)} failed to load after ${result.status} (${error instanceof Error ? error.name : "error"}) from ${display(task.from)}`);
      return;
    }
    if (permanentRedirect(second.status)) {
      note(`link ${display(task.url)} redirected more than once (${result.status} -> ${display(next)}) from ${display(task.from)}`);
      return;
    }
    if (second.status !== 200) {
      note(`link ${display(task.url)} ${result.status} to ${second.status} ${display(next)} from ${display(task.from)}`);
      return;
    }
    if (collectedSoft(second)) note(`link ${display(task.url)} redirected to the not-found page ${display(next)} from ${display(task.from)}`);
    counts.redirects += 1;
    await maybeParse(next, second, task.base);
    return;
  }
  note(`link ${result.status} ${display(task.url)} from ${display(task.from)}`);
}

function maybeParse(url, result, base) {
  if (!/text\/html/.test(result.type) || !result.body) return;
  const path = normalizePath(new URL(url).pathname);
  if (!localeOf(path)) return;
  if (parsedPaths.has(path)) return;
  return parsePage(url, result.body, base, { sitemap: false });
}

async function checkDocument(task) {
  let result;
  try {
    result = await getResponse(task.url);
  } catch (error) {
    note(`page ${display(task.url)} failed to load (${error instanceof Error ? error.name : "error"})`);
    return;
  }
  if (permanentRedirect(result.status)) {
    note(`sitemap URL ${display(task.url)} redirected ${result.status} to ${result.location || "(no location)"}`);
    return;
  }
  if (result.status !== 200) {
    note(`sitemap URL ${display(task.url)} returned ${result.status}`);
    return;
  }
  if (!/text\/html|xml/.test(result.type) && !result.body.trimStart().startsWith("<")) {
    note(`sitemap URL ${display(task.url)} is not an HTML page (${result.type || "no content type"})`);
    return;
  }
  counts.pages += 1;
  const locale = localeOf(task.path);
  if (locale === "en") counts.en += 1;
  else if (locale === "ar") counts.ar += 1;
  else note(`sitemap URL ${display(task.url)} has no /en or /ar prefix`);
  console.log(`page ${task.path}`);
  await parsePage(task.url, result.body, task.base, { sitemap: true });
}

async function runTask(task) {
  if (task.role === "document") return checkDocument(task);
  if (task.role === "asset") return checkAsset(task);
  if (task.role === "final") return checkFinal(task);
  return checkInternal(task);
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
      const result = await requestOnce(`${base}/en`);
      if (result.status === 200) return;
      last = String(result.status);
    } catch (error) {
      last = error instanceof Error ? error.message : "connection refused";
    }
    await delay(300);
  }
  throw new Error(`production server did not become ready (${last})`);
}

function finishClusters(entries) {
  const ready = [];
  for (const entry of entries) {
    const info = pageInfo.get(entry.path);
    if (!info) continue;
    for (const issue of hreflangMismatch(entry.path, info.hreflang, entry.alternates)) note(issue);
    ready.push({ path: entry.path, hreflang: info.hreflang });
  }
  for (const issue of hreflangClusterIssues(ready)) note(issue);
}

async function crawl(base) {
  const sitemapUrl = `${base}/sitemap.xml`;
  const sitemap = await getResponse(sitemapUrl);
  if (sitemap.status !== 200) {
    note(`sitemap returned ${sitemap.status}`);
    return;
  }
  const rawPages = parseSitemap(sitemap.body);
  if (rawPages.length < 2) note(`sitemap listed ${rawPages.length} URLs`);
  const entries = [];
  const locPaths = new Set();
  for (const page of rawPages) {
    const classified = classifyReference(page.loc, sitemapUrl, base);
    if (classified.kind !== "internal") {
      note(`sitemap loc ${page.loc} is not an internal URL`);
      continue;
    }
    const alternates = {};
    for (const [lang, href] of Object.entries(page.alternates)) {
      const target = alternateTarget(href, sitemapUrl, base);
      if (target.issue) {
        note(`sitemap ${classified.path} ${target.issue}`);
        continue;
      }
      alternates[lang] = target.path;
      if (!target.path) note(`sitemap ${classified.path} hreflang ${lang} has no path`);
    }
    locPaths.add(classified.path);
    entries.push({ path: classified.path, localUrl: classified.localUrl, alternates });
  }
  for (const entry of entries) {
    for (const [lang, target] of Object.entries(entry.alternates)) {
      if (!locPaths.has(target)) note(`sitemap ${entry.path} hreflang ${lang} target ${target} is not in the sitemap`);
    }
    enqueue({ role: "document", url: entry.localUrl, path: entry.path, base });
  }
  await drain();
  finishClusters(entries);
  if (counts.en === 0 || counts.ar === 0) {
    note(`expected both languages in the sitemap, got ${counts.en} English and ${counts.ar} Arabic pages`);
  }
}

async function main() {
  let child = null;
  let base = givenBase;
  try {
    if (!base) {
      if (!(skipBuild && existsSync(path.join(root, ".next", "BUILD_ID")))) {
        console.log("Building the production app for the link check…");
        await runBuild();
      }
      const started = startServer();
      child = started.child;
      base = `http://127.0.0.1:${port}`;
      await waitUntilReady(base, child);
    }
    console.log(`Checking ${base}`);
    await crawl(base);
    if (problems.size) {
      const list = [...problems].sort();
      console.error(`\n${list.length} link problem${list.length === 1 ? "" : "s"}:`);
      for (const problem of list) console.error(`- ${problem}`);
      console.error(
        `Checked ${counts.pages} sitemap pages (${counts.en} English, ${counts.ar} Arabic), ${counts.links} links, ${counts.assets} assets, ${counts.external} external URLs.`,
      );
      process.exitCode = 1;
      return;
    }
    console.log(
      `Links ok. ${counts.pages} sitemap pages (${counts.en} English, ${counts.ar} Arabic), ${counts.links} links (${counts.redirects} one-hop redirects), ${counts.assets} assets, ${counts.external} external https URLs, ${counts.mailto} mailto, ${counts.whatsapp} WhatsApp.`,
    );
  } finally {
    if (child && child.exitCode === null) {
      child.kill("SIGTERM");
      await delay(400);
      if (child.exitCode === null) child.kill("SIGKILL");
    }
  }
}

await main();
