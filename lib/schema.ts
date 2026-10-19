import type { Post } from "@/data/blog";
import type { Faq, Product } from "@/data/products";
import { getCategory } from "@/data/products";
import { site } from "@/data/site";
import { pageCountFor } from "@/lib/catalog";

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function productSchema(
  product: Product,
  siteUrl: string,
  options?: { name?: string; description?: string; url?: string },
) {
  const category = getCategory(product.category);
  const url = options?.url ?? `${siteUrl}/product/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: options?.name ?? product.title,
    description: options?.description ?? product.shortDescription,
    sku: product.slug,
    category: category?.name,
    brand: { "@type": "Brand", name: site.name },
    image: [`${siteUrl}/product/${product.slug}/opengraph-image`],
    url,
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Page count",
      value: pageCountFor(product),
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      url,
      seller: { "@type": "Organization", name: site.legalName },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnLink: `${siteUrl}/legal/refunds`,
      },
    },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbList(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function breadcrumbSchema(siteUrl: string, product: Product) {
  return breadcrumbList([
    { name: "Home", url: siteUrl },
    { name: "Shop", url: `${siteUrl}/shop` },
    { name: product.title, url: `${siteUrl}/product/${product.slug}` },
  ]);
}

export function websiteSchema(siteUrl: string, lang: "en" | "ar" = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    inLanguage: lang === "ar" ? "ar" : "en",
    description: site.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleSchema(post: Post, siteUrl: string, pageUrl?: string) {
  const url = pageUrl ?? `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: post.lang === "ar" ? "ar" : "en",
    author: { "@type": "Organization", name: "Vellum Press", url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: "Vellum Press",
      url: siteUrl,
      email: site.email,
    },
    image: [
      post.lang === "ar" ? `${siteUrl}/blog/opengraph-image` : `${siteUrl}/blog/${post.slug}/opengraph-image`,
    ],
    mainEntityOfPage: url,
  };
}

export function organizationSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    url: siteUrl,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dammam",
      addressCountry: "SA",
    },
  };
}
