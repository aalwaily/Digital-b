import { posts } from "@/data/blog";
import { legalPages } from "@/data/legal";
import { products } from "@/data/products";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = origin();
  const staticRoutes = ["", "/shop", "/about", "/contact", "/faq", "/blog"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: lastModified("2026-10-18"),
  }));
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: lastModified(product.published),
  }));
  const postRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: lastModified(post.date),
  }));
  const legalRoutes = legalPages.map((page) => ({
    url: `${siteUrl}/legal/${page.slug}`,
    lastModified: lastModified(page.updated),
  }));
  return [...staticRoutes, ...productRoutes, ...postRoutes, ...legalRoutes];
}
