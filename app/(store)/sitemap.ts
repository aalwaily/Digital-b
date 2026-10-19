import { postPath, posts } from "@/data/blog";
import { legalPages } from "@/data/legal";
import { products } from "@/data/products";
import { canonicalUrl } from "@/lib/seo";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/shop", "/about", "/contact", "/faq", "/blog", "/ar", "/ar/blog"].map((path) => ({
    url: canonicalUrl(path),
    lastModified: lastModified("2026-10-19"),
  }));
  const productRoutes = products.flatMap((product) => [
    { url: canonicalUrl(`/product/${product.slug}`), lastModified: lastModified(product.published) },
    { url: canonicalUrl(`/ar/product/${product.slug}`), lastModified: lastModified(product.published) },
  ]);
  const postRoutes = posts.map((post) => ({
    url: canonicalUrl(postPath(post)),
    lastModified: lastModified(post.date),
  }));
  const legalRoutes = legalPages.map((page) => ({
    url: canonicalUrl(`/legal/${page.slug}`),
    lastModified: lastModified(page.updated),
  }));
  return [...staticRoutes, ...productRoutes, ...postRoutes, ...legalRoutes];
}
