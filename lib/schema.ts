import type { Post } from "@/data/blog";
import type { Faq, Product } from "@/data/products";
import { site } from "@/data/site";
import { pageCountFor } from "@/lib/catalog";
import { localizeCategory, localizeProduct } from "@/lib/i18n/content";
import { localePath, type Locale } from "@/lib/i18n/config";

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function productSchema(product: Product, siteUrl: string, locale: Locale = "en") {
  const localized = localizeProduct(product, locale);
  const category = localizeCategory(product.category, locale);
  const path = localePath(locale, `/product/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: localized.title,
    description: localized.shortDescription,
    sku: product.slug,
    category: category?.name,
    brand: { "@type": "Brand", name: site.name },
    image: [`${siteUrl}${path}/opengraph-image`],
    url: `${siteUrl}${path}`,
    inLanguage: locale,
    additionalProperty: {
      "@type": "PropertyValue",
      name: locale === "ar" ? "عدد الصفحات" : "Page count",
      value: pageCountFor(product),
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${siteUrl}${path}`,
      seller: { "@type": "Organization", name: site.legalName },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnLink: `${siteUrl}${localePath(locale, "/legal/refunds")}`,
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

export function breadcrumbSchema(siteUrl: string, product: Product, locale: Locale = "en") {
  const localized = localizeProduct(product, locale);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${siteUrl}${localePath(locale, "/")}` },
      { "@type": "ListItem", position: 2, name: locale === "ar" ? "المتجر" : "Shop", item: `${siteUrl}${localePath(locale, "/shop")}` },
      {
        "@type": "ListItem",
        position: 3,
        name: localized.title,
        item: `${siteUrl}${localePath(locale, `/product/${product.slug}`)}`,
      },
    ],
  };
}

export function websiteSchema(siteUrl: string, locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: `${siteUrl}${localePath(locale, "/")}`,
    inLanguage: locale,
    description: site.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}${localePath(locale, "/shop")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleSchema(post: Post, siteUrl: string, locale: Locale = "en") {
  const path = localePath(locale, `/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    inLanguage: locale,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.legalName, url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      url: siteUrl,
      email: site.email,
    },
    image: [`${siteUrl}${path}/opengraph-image`],
    mainEntityOfPage: `${siteUrl}${path}`,
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
