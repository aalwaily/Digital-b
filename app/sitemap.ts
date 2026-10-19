import { posts } from "@/data/blog";
import { legalPages } from "@/data/legal";
import { products } from "@/data/products";
import { locales, localePath, type Locale } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Next renders this metadata route by calling Date#toISOString on lastModified.
// An invalid Date throws RangeError and the route responds HTTP 500.
// Only accept a calendar date, and always construct it as UTC midnight.
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

function origin(): string {
  const raw = getSiteUrl().trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

function entry(siteUrl: string, path: string, modified: string): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${siteUrl}${localePath(locale, path)}`]),
  ) as Record<Locale, string>;
  return {
    url: `${siteUrl}${localePath("en", path)}`,
    lastModified: lastModified(modified),
    alternates: { languages: { ...languages, "x-default": languages.en } },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = origin();
  const staticRoutes = ["/", "/shop", "/about", "/contact", "/faq", "/blog"].map((path) =>
    entry(siteUrl, path, "2026-10-19"),
  );
  const productRoutes = products.map((product) => entry(siteUrl, `/product/${product.slug}`, product.published));
  const postRoutes = posts.map((post) => entry(siteUrl, `/blog/${post.slug}`, post.date));
  const legalRoutes = legalPages.map((page) => entry(siteUrl, `/legal/${page.slug}`, page.updated));
  const arabic = [...staticRoutes, ...productRoutes, ...postRoutes, ...legalRoutes].map((item) => ({
    ...item,
    url: item.alternates?.languages?.ar ?? item.url,
  }));
  return [...staticRoutes, ...productRoutes, ...postRoutes, ...legalRoutes, ...arabic];
}
