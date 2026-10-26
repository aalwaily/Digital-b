import type { Post } from "@/data/blog";
import type { Faq, Product } from "@/data/products";
import { site } from "@/data/site";
import { fileFacts } from "@/lib/catalog";
import { stripBidiIsolates } from "@/lib/i18n/bidi";
import { localizeCategory, localizeProduct } from "@/lib/i18n/content";
import { localePath, type Locale } from "@/lib/i18n/config";
import { staticSeo } from "@/data/page-seo";
import { checkoutOptions } from "@/lib/payments";

/**
 * Checkout is closed until a provider is switched on. PreOrder would claim a
 * buyer can place an order now and receive the file later. OutOfStock is the
 * honest ItemAvailability: the guide and its price are real, and it cannot
 * be purchased until payment opens. InStock is only used once checkout is open,
 * because a PDF has no inventory limit.
 */
export function offerAvailability(open = checkoutOptions().open) {
  return open ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function productSchema(product: Product, siteUrl: string, locale: Locale = "en") {
  const localized = localizeProduct(product, locale);
  const category = localizeCategory(product.category, locale);
  const path = localePath(locale, `/product/${product.slug}`);
  const url = `${siteUrl}${path}`;
  const facts = fileFacts(product);
  const ar = locale === "ar";
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
    additionalProperty: [
      { "@type": "PropertyValue", name: ar ? "عدد الصفحات" : "Page count", value: facts.pages },
      { "@type": "PropertyValue", name: ar ? "صفحات العيّنة" : "Sample pages", value: facts.samplePages },
      { "@type": "PropertyValue", name: ar ? "صيغة الملف" : "File format", value: "PDF" },
      {
        "@type": "PropertyValue",
        name: ar ? "مقاس الصفحة" : "Page size",
        value: ar ? "مقاس Letter الأمريكي (8.5 × 11 إنش)" : "US Letter (8.5 x 11 in)",
      },
      { "@type": "PropertyValue", name: ar ? "لغة الملف" : "File language", value: ar ? "الإنجليزية" : "English" },
      { "@type": "PropertyValue", name: ar ? "عدد الملفات" : "PDF files", value: facts.files },
      { "@type": "PropertyValue", name: ar ? "حجم الملف" : "File size", value: facts.bytes, unitText: ar ? "بايت" : "bytes" },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: offerAvailability(),
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
    description: locale === "ar" ? staticSeo.arabicHome.description : staticSeo.home.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}${localePath(locale, "/shop")}?q={search_term_string}`,
      },
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
