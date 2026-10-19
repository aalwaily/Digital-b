import { getPost, postLang, postPath, posts, type Post } from "@/data/blog";
import { legalPages } from "@/data/legal";
import { products } from "@/data/products";
import { locales, localePath, type Locale } from "@/lib/i18n/config";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

function lastModified(isoDate: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    throw new Error(`Sitemap lastModified must be YYYY-MM-DD, received ${JSON.stringify(isoDate)}`);
  }
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Sitemap lastModified is not a real date: ${isoDate}`);
  }
  return date;
}

function absolute(path: string) {
  return `${CANONICAL_ORIGIN}${path}`;
}

function paired(path: string, modified: string): MetadataRoute.Sitemap {
  const languages = {
    en: absolute(localePath("en", path)),
    ar: absolute(localePath("ar", path)),
    "x-default": absolute(localePath("en", path)),
  };
  return locales.map((locale) => ({
    url: absolute(localePath(locale, path)),
    lastModified: lastModified(modified),
    alternates: { languages },
  }));
}

function postLanguages(post: Post) {
  if (post.translationOf) {
    const other = getPost(post.translationOf);
    if (other) {
      const enPath = postLang(post) === "ar" ? postPath(other) : postPath(post);
      const arPath = postLang(post) === "ar" ? postPath(post) : postPath(other);
      return { en: absolute(enPath), ar: absolute(arPath), "x-default": absolute(enPath) };
    }
  }
  if (!post.lang) {
    const enPath = localePath("en", `/blog/${post.slug}`);
    const arPath = localePath("ar", `/blog/${post.slug}`);
    return { en: absolute(enPath), ar: absolute(arPath), "x-default": absolute(enPath) };
  }
  const self = absolute(postPath(post));
  return postLang(post) === "ar" ? { ar: self, "x-default": self } : { en: self, "x-default": self };
}

function postEntries(post: Post): MetadataRoute.Sitemap {
  const languages = postLanguages(post);
  const available: Locale[] = post.lang === "ar" ? ["ar"] : post.lang === "en" ? ["en"] : ["en", "ar"];
  return available.map((locale) => ({
    url: absolute(post.lang ? postPath(post) : localePath(locale, `/blog/${post.slug}`)),
    lastModified: lastModified(post.date),
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/shop", "/about", "/contact", "/faq", "/blog"].flatMap((path) =>
    paired(path, "2026-10-19"),
  );
  const productRoutes = products.flatMap((product) => paired(`/product/${product.slug}`, product.published));
  const postRoutes = posts.flatMap((post) => postEntries(post));
  const legalRoutes = legalPages.flatMap((page) => paired(`/legal/${page.slug}`, page.updated));
  return [...staticRoutes, ...productRoutes, ...postRoutes, ...legalRoutes];
}
