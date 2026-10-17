import { posts } from "@/data/blog";
import { legalPages } from "@/data/legal";
import { products } from "@/data/products";
import { getSiteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const staticRoutes = ["", "/shop", "/about", "/contact", "/faq", "/blog"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: new Date("2026-10-01"),
  }));
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: new Date(product.published),
  }));
  const postRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));
  const legalRoutes = legalPages.map((page) => ({
    url: `${siteUrl}/legal/${page.slug}`,
    lastModified: new Date(page.updated),
  }));
  return [...staticRoutes, ...productRoutes, ...postRoutes, ...legalRoutes];
}
