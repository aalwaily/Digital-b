import { CANONICAL_ORIGIN } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/orders/",
        "/api/",
        "/en/cart",
        "/en/checkout",
        "/en/orders/",
        "/ar/cart",
        "/ar/checkout",
        "/ar/orders/",
      ],
    },
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: CANONICAL_ORIGIN,
  };
}
