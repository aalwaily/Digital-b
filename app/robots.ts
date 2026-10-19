import { getSiteUrl } from "@/lib/site-url";
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
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
