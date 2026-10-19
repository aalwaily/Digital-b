import type { Post } from "@/data/blog";
import type { Faq, Product } from "@/data/products";
import { site } from "@/data/site";
import { pageCountFor } from "@/lib/catalog";
import { stripBidiIsolates } from "@/lib/i18n/bidi";
import { localizeCategory, localizeProduct } from "@/lib/i18n/content";
import { localePath, type Locale } from "@/lib/i18n/config";

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function productSchema(product: Product, siteUrl: string, locale: Locale = "en") {
  const localized = localizeProduct(product, locale);
  const category = localizeCategory(product.category, locale);
  const path = localePath(locale, `/product/${product.slug}`);
  const url = `${siteUrl}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: stripBidiIsolates(localized.title),
    description: stripBidiIsolates(localized.shortDescription),
    sku: product.slug,
    category: category ? stripBidiIsolates(category.name) : undefined,
    brand: { "@type": "Brand", name: site.name },
    image: [`${url}/opengraph-image`],
    url,
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
      url,
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
      name: stripBidiIsolates(faq.question),
      acceptedAnswer: { "@type": "Answer", text: stripBidiIsolates(faq.answer) },
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

export function breadcrumbSchema(siteUrl: string, product: Product, locale: Locale = "en") {
  const localized = localizeProduct(product, locale);
  return breadcrumbList([
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteUrl}${localePath(locale, "/")}` },
    { name: locale === "ar" ? "المتجر" : "Shop", url: `${siteUrl}${localePath(locale, "/shop")}` },
    {
      name: stripBidiIsolates(localized.title),
      url: `${siteUrl}${localePath(locale, `/product/${product.slug}`)}`,
    },
  ]);
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
  const url = `${siteUrl}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: stripBidiIsolates(post.seoTitle ?? post.title),
    description: stripBidiIsolates(post.seoDescription ?? post.description),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: post.lang ?? locale,
    author: { "@type": "Organization", name: "Vellum Press", url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: "Vellum Press",
      url: siteUrl,
      email: site.email,
    },
    image: [`${url}/opengraph-image`],
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
