/**
 * Pure rules for the production link check.
 * The crawler in check-links.mjs applies these to HTML from a local server.
 */

export const CONTACT_EMAIL = "glarz.com@gmail.com";

export const SITE_HOSTS = new Set(["getvellumpress.com", "www.getvellumpress.com"]);

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function decodeHtml(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)));
}

export function parseAttrs(source) {
  const attrs = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(re)) {
    const name = match[1].toLowerCase();
    if (name.startsWith("<")) continue;
    attrs[name] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attrs;
}

export function normalizePath(pathname) {
  let path = pathname || "/";
  try {
    path = decodeURI(path);
  } catch {
    // Keep the raw path when a percent-escape is unfinished.
  }
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

export function localeOf(pathname) {
  const path = normalizePath(pathname);
  if (path === "/en" || path.startsWith("/en/")) return "en";
  if (path === "/ar" || path.startsWith("/ar/")) return "ar";
  return null;
}

/** Old catalog address. Pages should link to the shop, which is where this redirects. */
export function legacyProductsTarget(pathname, pageLocale) {
  const path = normalizePath(pathname);
  if (path === "/en/products") return "/en/shop";
  if (path === "/ar/products") return "/ar/shop";
  if (path === "/products") return `/${pageLocale === "ar" ? "ar" : "en"}/shop`;
  return null;
}

export function isLocalHost(hostname) {
  return LOCAL_HOSTS.has(String(hostname || "").toLowerCase().replace(/^\[|\]$/g, ""));
}

export function isInternalHost(hostname, base) {
  const host = String(hostname || "").toLowerCase();
  if (SITE_HOSTS.has(host) || isLocalHost(host)) return true;
  try {
    return host === new URL(base).hostname.toLowerCase();
  } catch {
    return false;
  }
}

export function isWhatsAppHost(hostname) {
  const host = String(hostname || "").toLowerCase();
  return host === "wa.me" || host === "api.whatsapp.com" || host === "web.whatsapp.com" || host.endsWith(".whatsapp.com");
}

function toBase(url, base) {
  const local = new URL(base);
  const next = new URL(url.toString());
  next.protocol = local.protocol;
  next.hostname = local.hostname;
  next.port = local.port;
  next.hash = "";
  return next;
}

export function externalIssue(raw) {
  const trimmed = decodeHtml(raw).trim();
  if (!trimmed) return "is empty";
  if (/\s/.test(trimmed)) return "contains whitespace";
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return "is not a valid URL";
  }
  if (url.protocol !== "https:") return "is not https";
  if (!url.hostname || !url.hostname.includes(".")) return "has no host";
  return null;
}

export function mailtoIssue(raw) {
  const trimmed = decodeHtml(raw).trim();
  if (/\s/.test(trimmed)) return "mailto link contains whitespace";
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return "mailto link is malformed";
  }
  if (url.protocol !== "mailto:") return "mailto link is malformed";
  let address = "";
  try {
    address = decodeURIComponent(url.pathname).trim();
  } catch {
    return "mailto address is malformed";
  }
  if (!address) {
    if (/[?&](subject|body)=/i.test(url.search)) return null;
    return "mailto link is missing an address";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return `mailto address "${address}" is malformed`;
  if (address.toLowerCase() !== CONTACT_EMAIL) {
    return `contact email must be ${CONTACT_EMAIL}, found ${address}`;
  }
  return null;
}

export function whatsAppIssue(raw) {
  const trimmed = decodeHtml(raw).trim();
  if (/\s/.test(trimmed)) return "WhatsApp link contains whitespace";
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return "WhatsApp link is not a valid URL";
  }
  if (url.protocol !== "https:") return "WhatsApp link is not https";
  const host = url.hostname.toLowerCase();
  if (host === "api.whatsapp.com" || host === "web.whatsapp.com") {
    const phone = (url.searchParams.get("phone") || "").replace(/^\+/, "");
    if (/^\d{8,15}$/.test(phone)) return null;
    return "WhatsApp link is missing a phone number";
  }
  let phone = "";
  try {
    phone = decodeURIComponent(url.pathname.replace(/^\//, "")).replace(/^\+/, "");
  } catch {
    return "WhatsApp phone number is malformed";
  }
  if (!phone) {
    const text = url.searchParams.get("text");
    if (text && text.trim()) return null;
    return "WhatsApp link has no phone number or message";
  }
  if (!/^\d{8,15}$/.test(phone)) return `WhatsApp phone "${phone}" is malformed`;
  return null;
}

/**
 * Classify one href or src against the page that referenced it.
 * Internal results carry a URL on `base` so the crawler never calls production.
 * External https URLs are not fetched.
 */
export function classifyReference(raw, pageUrl, base) {
  const trimmed = decodeHtml(String(raw ?? "")).trim();
  if (!trimmed || trimmed.startsWith("#")) return { kind: "skip" };
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("mailto:")) return { kind: "mailto", href: trimmed };
  if (lower.startsWith("tel:") || lower.startsWith("sms:")) return { kind: "skip" };
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("blob:")) {
    return { kind: "bad", issue: `unsupported link ${trimmed.slice(0, 100)}` };
  }
  if (/\s/.test(trimmed)) return { kind: "bad", issue: `link contains whitespace: ${trimmed.slice(0, 100)}` };
  let url;
  try {
    url = new URL(trimmed, pageUrl);
  } catch {
    return { kind: "bad", issue: `malformed link ${trimmed.slice(0, 100)}` };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { kind: "bad", issue: `unsupported link ${trimmed.slice(0, 100)}` };
  }
  if (isWhatsAppHost(url.hostname)) return { kind: "whatsapp", href: url.toString() };
  if (isInternalHost(url.hostname, base)) {
    const local = toBase(url, base);
    const path = normalizePath(local.pathname);
    const legacy = legacyProductsTarget(path, localeOf(new URL(pageUrl).pathname));
    if (legacy) {
      return {
        kind: "bad",
        path,
        issue: `points at the old /products path ${path}; point it at ${legacy}`,
      };
    }
    return { kind: "internal", localUrl: local.toString(), path, search: local.search };
  }
  if (url.protocol !== "https:") {
    return { kind: "bad", issue: `external link is not https: ${trimmed.slice(0, 140)}` };
  }
  const issue = externalIssue(url.toString());
  if (issue) return { kind: "bad", issue: `external link ${issue}: ${trimmed.slice(0, 140)}` };
  return { kind: "external", href: url.toString() };
}

export function canonicalIssue(pageUrl, href, base) {
  const classified = classifyReference(href, pageUrl, base);
  if (classified.kind !== "internal") return `canonical ${classified.issue || "is not an internal URL"}`;
  const pagePath = normalizePath(new URL(pageUrl).pathname);
  if (classified.path !== pagePath) {
    const pageLocale = localeOf(pagePath);
    const canonicalLocale = localeOf(classified.path);
    if (pageLocale && canonicalLocale && pageLocale !== canonicalLocale) {
      return `canonical ${classified.path} is the ${canonicalLocale} version of ${pagePath}`;
    }
    return `canonical ${classified.path} does not match ${pagePath}`;
  }
  const trimmed = decodeHtml(href).trim();
  if (/^https?:\/\//i.test(trimmed)) {
    let host = "";
    try {
      host = new URL(trimmed).hostname.toLowerCase();
    } catch {
      return "canonical is not a valid URL";
    }
    if (!SITE_HOSTS.has(host)) return `canonical host ${host} is not getvellumpress.com`;
  }
  return null;
}

export function alternateTarget(href, pageUrl, base) {
  const classified = classifyReference(href, pageUrl, base);
  if (classified.kind !== "internal") {
    return { issue: `hreflang ${classified.issue || "is not an internal URL"}` };
  }
  const trimmed = decodeHtml(href).trim();
  if (/^https?:\/\//i.test(trimmed)) {
    let host = "";
    try {
      host = new URL(trimmed).hostname.toLowerCase();
    } catch {
      return { issue: "hreflang is not a valid URL" };
    }
    if (!SITE_HOSTS.has(host)) return { issue: `hreflang host ${host} is not getvellumpress.com` };
  }
  return { path: classified.path, localUrl: classified.localUrl };
}

export function hreflangMismatch(pagePath, htmlMap, sitemapMap) {
  const issues = [];
  const keys = new Set([...Object.keys(htmlMap), ...Object.keys(sitemapMap)]);
  for (const key of [...keys].sort()) {
    if ((htmlMap[key] || "") !== (sitemapMap[key] || "")) {
      issues.push(
        `${pagePath} hreflang ${key} is ${htmlMap[key] || "missing"}, sitemap says ${sitemapMap[key] || "missing"}`,
      );
    }
  }
  return issues;
}

/** Same hreflang set on every URL in the set, each language pointing at itself, x-default on the default language. */
export function hreflangClusterIssues(pages) {
  const issues = [];
  const byPath = new Map(pages.map((page) => [page.path, page]));
  for (const page of pages) {
    const langs = page.hreflang || {};
    const own = localeOf(page.path);
    if (!own) issues.push(`${page.path} has no language prefix`);
    if (!langs["x-default"]) issues.push(`${page.path} is missing hreflang x-default`);
    if (own && langs[own] !== page.path) {
      issues.push(`${page.path} hreflang ${own} is ${langs[own] || "missing"}, expected ${page.path}`);
    }
    if (langs.en && langs["x-default"] && langs["x-default"] !== langs.en) {
      issues.push(`${page.path} hreflang x-default is ${langs["x-default"]}, expected ${langs.en}`);
    }
    if (!langs.en && langs.ar && langs["x-default"] && langs["x-default"] !== langs.ar) {
      issues.push(`${page.path} hreflang x-default is ${langs["x-default"]}, expected ${langs.ar}`);
    }
    for (const [lang, target] of Object.entries(langs)) {
      const other = byPath.get(target);
      if (!other) {
        issues.push(`${page.path} hreflang ${lang} target ${target} was not checked`);
        continue;
      }
      const keys = new Set([...Object.keys(langs), ...Object.keys(other.hreflang || {})]);
      for (const key of keys) {
        if ((langs[key] || "") !== ((other.hreflang || {})[key] || "")) {
          issues.push(
            `${page.path} hreflang ${key} is ${langs[key] || "missing"}, but ${target} has ${key}=${(other.hreflang || {})[key] || "missing"}`,
          );
        }
      }
    }
  }
  return [...new Set(issues)];
}

export function sampleForPreview(pathname) {
  const path = normalizePath(pathname);
  const match = path.match(/^\/previews\/([a-z0-9-]+)\.(?:png|jpe?g|webp)$/i);
  if (!match) return null;
  return `/samples/${match[1]}-sample.pdf`;
}

export function underlyingPublicPath(urlString) {
  const url = new URL(urlString);
  if (url.pathname === "/_next/image") {
    const inner = url.searchParams.get("url");
    if (inner && inner.startsWith("/")) return normalizePath(inner.split("?")[0]);
  }
  return normalizePath(url.pathname);
}

export function kindForPath(pathname, fallback = "asset") {
  const path = normalizePath(pathname).toLowerCase();
  if (path.endsWith(".pdf") || path.startsWith("/samples/")) return "download";
  if (path.startsWith("/previews/")) return "preview";
  if (/\.(?:woff2?|ttf|otf)$/.test(path)) return "font";
  if (path.endsWith(".css")) return "stylesheet";
  if (/\.(?:mjs|js)$/.test(path)) return "script";
  if (/\.(?:png|jpe?g|gif|webp|avif|svg|ico)$/.test(path)) return "image";
  if (path.endsWith(".webmanifest") || path.endsWith("/manifest.json")) return "manifest";
  if (path.includes("/opengraph-image") || path.includes("/twitter-image")) return "og:image";
  if (path === "/icon" || path === "/apple-icon" || path.endsWith("/favicon.ico")) return "favicon";
  return fallback;
}

export function assetTypeIssue(kind, contentType) {
  const value = String(contentType || "").toLowerCase();
  if (!value) return null;
  if (value.includes("text/html") || value.includes("application/xhtml")) {
    return `returned HTML (${contentType})`;
  }
  if (kind === "download" && !value.includes("pdf") && !value.includes("octet-stream")) {
    return `expected a PDF, got ${contentType}`;
  }
  if (
    (kind === "image" || kind === "preview" || kind === "og:image" || kind === "favicon") &&
    !value.includes("image/")
  ) {
    return `expected an image, got ${contentType}`;
  }
  if (kind === "font" && !/font|woff|octet-stream/.test(value)) return `expected a font, got ${contentType}`;
  if (kind === "script" && !/javascript|ecmascript/.test(value)) return `expected javascript, got ${contentType}`;
  if (kind === "stylesheet" && !value.includes("css")) return `expected css, got ${contentType}`;
  if (kind === "manifest" && !/json|manifest/.test(value)) return `expected a manifest, got ${contentType}`;
  return null;
}

export function cssUrls(css) {
  const found = [];
  const re = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^)\s]+))\s*\)/g;
  for (const match of String(css).matchAll(re)) {
    const raw = (match[1] ?? match[2] ?? match[3] ?? "").trim();
    if (!raw || raw.startsWith("data:") || raw.startsWith("blob:") || raw.startsWith("#")) continue;
    found.push(raw);
  }
  return found;
}

export function isSoftNotFound(html) {
  const title = (String(html).match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "";
  return title.includes("Page Not Found") || title.includes("الصفحة غير موجودة");
}

export function isAppError(html) {
  return /Application error|Unhandled Runtime Error|server component error/i.test(String(html));
}

function relTokens(rel) {
  return String(rel || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function walkJson(value, visit, key) {
  if (typeof value === "string") {
    visit(value, key);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walkJson(item, visit);
    return;
  }
  if (value && typeof value === "object") {
    for (const [childKey, child] of Object.entries(value)) walkJson(child, visit, childKey);
  }
}

/**
 * Pull references out of one rendered document.
 * Classification against the local server happens in the crawler.
 */
export function collectDocument(html) {
  const source = String(html);
  const refs = [];
  const anchors = [];
  const canonicals = [];
  const hreflang = {};
  const emails = [];
  let jsonLdInvalid = false;
  let robotsNoindex = false;
  let ogUrl = null;

  const addRef = (raw, kind) => {
    if (!raw) return;
    refs.push({ raw: decodeHtml(raw).trim(), kind });
  };

  const tagRe = /<(a|img|source|link|script|meta|area|video|audio|image|use)\b([^>]*)>/gi;
  for (const match of source.matchAll(tagRe)) {
    const tag = match[1].toLowerCase();
    const attrs = parseAttrs(match[2]);
    if (tag === "a" || tag === "area") anchors.push(attrs.href || "");
    if (tag === "img" || tag === "image" || tag === "use") {
      addRef(attrs.src, "image");
      addRef(attrs.href, "image");
      for (const item of srcsetUrls(attrs.srcset)) addRef(item, "image");
    }
    if (tag === "source") {
      addRef(attrs.src, "image");
      for (const item of srcsetUrls(attrs.srcset)) addRef(item, "image");
    }
    if (tag === "video" || tag === "audio") {
      addRef(attrs.src, "asset");
      addRef(attrs.poster, "image");
    }
    if (tag === "script" && attrs.src) addRef(attrs.src, "script");
    if (tag === "link") {
      const rel = relTokens(attrs.rel);
      if (rel.includes("canonical")) canonicals.push(attrs.href || "");
      else if (rel.includes("alternate") && attrs.hreflang) hreflang[attrs.hreflang.toLowerCase()] = attrs.href || "";
      else if (rel.includes("preconnect") || rel.includes("dns-prefetch")) anchors.push(attrs.href || "");
      else if (rel.includes("manifest")) addRef(attrs.href, "manifest");
      else if (rel.includes("stylesheet")) addRef(attrs.href, "stylesheet");
      else if (rel.includes("icon") || rel.includes("apple-touch-icon") || rel.includes("shortcut")) addRef(attrs.href, "favicon");
      else if (rel.includes("preload") || rel.includes("modulepreload")) {
        const as = (attrs.as || "").toLowerCase();
        const kind = as === "font" ? "font" : as === "style" ? "stylesheet" : as === "script" ? "script" : as === "image" ? "image" : "asset";
        addRef(attrs.href, kind);
      } else if (attrs.href) addRef(attrs.href, "asset");
    }
    if (tag === "meta") {
      const name = (attrs.property || attrs.name || attrs["http-equiv"] || "").toLowerCase();
      if (name === "robots" && /noindex/i.test(attrs.content || "")) robotsNoindex = true;
      if (name === "og:url") ogUrl = attrs.content || "";
      if (name === "og:image" || name === "og:image:url" || name === "og:image:secure_url" || name === "twitter:image") {
        addRef(attrs.content, "og:image");
      }
    }
  }

  for (const match of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    for (const raw of cssUrls(match[1])) addRef(raw, "asset");
  }

  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = parseAttrs(match[1]);
    if (!(attrs.type || "").toLowerCase().includes("ld+json")) continue;
    try {
      const data = JSON.parse(match[2]);
      walkJson(data, (value, key) => {
        if (key === "email" && value.includes("@")) emails.push(value.trim());
        if (/[{}]/.test(value)) return;
        const trimmed = value.trim();
        if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("/") || trimmed.toLowerCase().startsWith("mailto:")) {
          refs.push({ raw: trimmed, kind: "jsonld", fromJsonLd: true });
        }
      });
    } catch {
      jsonLdInvalid = true;
    }
  }

  return {
    anchors,
    refs,
    canonicals,
    hreflang,
    emails,
    jsonLdInvalid,
    robotsNoindex,
    ogUrl,
    softNotFound: isSoftNotFound(source),
    appError: isAppError(source),
  };
}

function srcsetUrls(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}

export function parseSitemap(xml) {
  const pages = [];
  for (const block of String(xml).split(/<url\b/i).slice(1)) {
    const locMatch = block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/i);
    if (!locMatch) continue;
    const alternates = {};
    for (const match of block.matchAll(/<(?:[\w-]+:)?link\b([^>]*)\/?>/gi)) {
      const attrs = parseAttrs(match[1]);
      const rel = relTokens(attrs.rel);
      if (rel.length && !rel.includes("alternate")) continue;
      const lang = (attrs.hreflang || "").toLowerCase();
      if (!lang || !attrs.href) continue;
      alternates[lang] = decodeHtml(attrs.href).trim();
    }
    pages.push({ loc: decodeHtml(locMatch[1]).trim(), alternates });
  }
  return pages;
}

export function permanentRedirect(status) {
  return status === 301 || status === 308;
}
