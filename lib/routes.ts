import { legalPages } from "@/data/legal";
import { categories, products } from "@/data/products";
import { blogLocalesForSlug } from "@/lib/blog-index";
import { localePath, stripLocale, type Locale } from "@/lib/i18n/config";

/** Internal rewrite target. Unmatched, so Next responds with the root not-found page and HTTP 404. */
export const NOT_FOUND_SLUG = "__404__";

const SHARED = new Set([
  "/",
  "/shop",
  "/about",
  "/contact",
  "/faq",
  "/blog",
  "/cart",
  "/checkout",
  "/checkout/success",
]);

const productSlugs = new Set(products.map((product) => product.slug));
const legalSlugs = new Set(legalPages.map((page) => page.slug));
const categorySlugs = new Set<string>(categories.map((category) => category.slug));

export function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname || "/";
}

/**
 * Old catalog address. One hop to the shop.
 * A locale prefix wins. Otherwise `preferred` is the remembered language,
 * or the browser language when nothing was remembered. Callers pass English
 * for crawlers.
 */
export function productsShopTarget(pathname: string, preferred: Locale): string | null {
  const path = normalizePathname(pathname);
  if (path === "/en/products") return "/en/shop";
  if (path === "/ar/products") return "/ar/shop";
  if (path === "/products") return `/${preferred}/shop`;
  return null;
}

export function notFoundPath(locale: Locale) {
  return `/${locale}/${NOT_FOUND_SLUG}`;
}

export function isNotFoundProbe(pathname: string) {
  return pathname === notFoundPath("en") || pathname === notFoundPath("ar");
}

/** True when this locale-prefixed path is a page the app can render. */
export function pageExists(pathname: string, locale: Locale) {
  // Home is `/en/opengraph-image`. Stripping the image suffix leaves an empty
  // path, which is the homepage, not an unknown route.
  const withoutImage = stripLocale(normalizePathname(pathname)).replace(/\/opengraph-image$/, "");
  const stripped = withoutImage === "" ? "/" : withoutImage;
  if (SHARED.has(stripped)) return true;
  const category = stripped.match(/^\/shop\/([^/]+)$/);
  if (category) return categorySlugs.has(category[1]);
  const product = stripped.match(/^\/product\/([^/]+)$/);
  if (product) return productSlugs.has(product[1]);
  const legal = stripped.match(/^\/legal\/([^/]+)$/);
  if (legal) return legalSlugs.has(legal[1]);
  const post = stripped.match(/^\/blog\/([^/]+)$/);
  if (post) return blogLocalesForSlug(post[1]).includes(locale);
  if (/^\/orders\/[^/]+$/.test(stripped)) return true;
  return false;
}

export type UnprefixedTarget = { locale: Locale; pathname: string };

/**
 * Where an unprefixed path should land.
 * Returns null when the path is not a real page, so the caller can 404
 * instead of redirecting onto a dead locale URL.
 * A journal slug that exists in only one language targets that language.
 */
export function unprefixedTarget(pathname: string, preferred: Locale): UnprefixedTarget | null {
  const path = normalizePathname(pathname);
  if (SHARED.has(path)) {
    return { locale: preferred, pathname: path === "/" ? `/${preferred}` : `/${preferred}${path}` };
  }
  const category = path.match(/^\/shop\/([^/]+)$/);
  if (category) {
    if (!categorySlugs.has(category[1])) return null;
    return { locale: preferred, pathname: `/${preferred}${path}` };
  }
  const product = path.match(/^\/product\/([^/]+)$/);
  if (product) {
    if (!productSlugs.has(product[1])) return null;
    return { locale: preferred, pathname: `/${preferred}${path}` };
  }
  const legal = path.match(/^\/legal\/([^/]+)$/);
  if (legal) {
    if (!legalSlugs.has(legal[1])) return null;
    return { locale: preferred, pathname: `/${preferred}${path}` };
  }
  const post = path.match(/^\/blog\/([^/]+)$/);
  if (post) {
    const locales = blogLocalesForSlug(post[1]);
    if (locales.length === 0) return null;
    const locale = locales.includes(preferred) ? preferred : locales[0];
    return { locale, pathname: `/${locale}${path}` };
  }
  if (/^\/orders\/[^/]+$/.test(path)) {
    return { locale: preferred, pathname: `/${preferred}${path}` };
  }
  return null;
}

/** Article links that omit a locale prefix. Single-language posts keep their real locale. */
export function articleHref(href: string) {
  if (/^https?:\/\//i.test(href)) return href;
  if (href === "/en" || href === "/ar" || href.startsWith("/en/") || href.startsWith("/ar/")) return href;
  const blog = href.match(/^\/blog\/([^/?#]+)(.*)$/);
  if (blog) {
    const locales = blogLocalesForSlug(blog[1]);
    const locale = locales.includes("en") ? "en" : locales[0];
    if (locale) return `/${locale}/blog/${blog[1]}${blog[2]}`;
  }
  return localePath("en", href);
}
