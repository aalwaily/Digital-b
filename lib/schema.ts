import type { Post } from "@/data/blog";
import type { Faq, Product } from "@/data/products";
import { getCategory } from "@/data/products";
import { site } from "@/data/site";
import { pageCountFor } from "@/lib/catalog";

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function productSchema(product: Product, siteUrl: string) {
  const category = getCategory(product.category);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    sku: product.slug,
    category: category?.name,
    brand: { "@type": "Brand", name: site.name },
    image: [`${siteUrl}/product/${product.slug}/opengraph-image`],
    url: `${siteUrl}/product/${product.slug}`,
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
      url: `${siteUrl}/product/${product.slug}`,
      seller: { "@type": "Organization", name: site.legalName },
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

export function breadcrumbSchema(siteUrl: string, product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `${siteUrl}/product/${product.slug}`,
      },
    ],
  };
}

export function websiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    description: site.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleSchema(post: Post, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.legalName, url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      url: siteUrl,
      email: site.email,
    },
    image: [`${siteUrl}/blog/${post.slug}/opengraph-image`],
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
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
      addressLocality: "Portland",
      addressRegion: "OR",
      addressCountry: "US",
    },
  };
}
