import type { Post } from "@/data/blog";
import { isBundle, type Faq, type Product } from "@/data/products";
import { site } from "@/data/site";
import { fileFacts } from "@/lib/catalog";
import { stripBidiIsolates } from "@/lib/i18n/bidi";
import { localizeCategory, localizeProduct } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath, type Locale } from "@/lib/i18n/config";
import { struckPrice } from "@/lib/money";
import { staticSeo } from "@/data/page-seo";
import { checkoutOptions } from "@/lib/payments";

/** Publisher mark. 512×512 PNG, above Google's 112×112 organization-logo minimum. */
export const LOGO_PATH = "/logo.png";
export const LOGO_SIZE = 512;

export function organizationId(siteUrl: string) {
  return `${siteUrl}/#organization`;
}

export function logoObject(siteUrl: string) {
  return {
    "@type": "ImageObject" as const,
    url: `${siteUrl}${LOGO_PATH}`,
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  };
}

/**
 * All sales are final. Google requires applicableCountry on MerchantReturnPolicy.
 * The publisher is in Saudi Arabia, so the country is SA. The linked policy page
 * is the full text (no refunds; a broken or missing file can be replaced by email).
 * merchantReturnDays and returnMethod are omitted: they apply only when a return
 * window exists, and MerchantReturnNotPermitted forbids one.
 */
export function merchantReturnPolicy(siteUrl: string, locale: Locale) {
  return {
    "@type": "MerchantReturnPolicy" as const,
    "@id": `${siteUrl}${localePath(locale, "/")}#return-policy`,
    applicableCountry: "SA",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    merchantReturnLink: `${siteUrl}${localePath(locale, "/legal/refunds")}`,
  };
}

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

function productImages(product: Product, siteUrl: string, pageUrl: string) {
  const card = `${pageUrl}/opengraph-image`;
  // Every guide ships a real sample-page preview. Bundles do not have their own.
  if (isBundle(product)) return [card];
  return [`${siteUrl}/previews/${product.slug}.png`, card];
}

export function productSchema(product: Product, siteUrl: string, locale: Locale = "en") {
  const localized = localizeProduct(product, locale);
  const category = localizeCategory(product.category, locale);
  const path = localePath(locale, `/product/${product.slug}`);
  const url = `${siteUrl}${path}`;
  const facts = fileFacts(product);
  const ar = locale === "ar";
  const struck = struckPrice(product.price, product.previousPrice, product.compareAtPrice);
  return {
    "@context": "https://schema.org",
    // DigitalDocument carries inLanguage, which Product itself does not define.
    // The listing text is in the page language. The PDF language is the separate
    // "File language" property below (every file is English).
    "@type": ["Product", "DigitalDocument"],
    name: stripBidiIsolates(localized.title),
    description: stripBidiIsolates(localized.shortDescription),
    sku: product.slug,
    category: category ? stripBidiIsolates(category.name) : undefined,
    brand: { "@type": "Brand", name: site.name },
    image: productImages(product, siteUrl, url),
    url,
    inLanguage: locale,
    encodingFormat: "application/pdf",
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
      ...(struck != null
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: struck.toFixed(2),
              priceCurrency: "USD",
              priceType: "https://schema.org/StrikethroughPrice",
            },
          }
        : {}),
      availability: offerAvailability(),
      itemCondition: "https://schema.org/NewCondition",
      url,
      seller: { "@type": "Organization", "@id": organizationId(siteUrl), name: site.legalName },
      hasMerchantReturnPolicy: merchantReturnPolicy(siteUrl, locale),
      // No shippingDetails. OfferShippingDetails requires a destination country
      // and a shipping rate. A PDF is not shipped, and a made-up destination
      // would be false. Google treats shippingDetails as optional.
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
  const category = localizeCategory(product.category, locale);
  const t = getDictionary(locale);
  return breadcrumbList([
    { name: t.product.home, url: `${siteUrl}${localePath(locale, "/")}` },
    { name: t.product.shop, url: `${siteUrl}${localePath(locale, "/shop")}` },
    ...(category
      ? [
          {
            name: stripBidiIsolates(category.name),
            url: `${siteUrl}${localePath(locale, `/shop/${category.slug}`)}`,
          },
        ]
      : []),
    {
      name: stripBidiIsolates(localized.title),
      url: `${siteUrl}${localePath(locale, `/product/${product.slug}`)}`,
    },
  ]);
}

export function catalogBreadcrumb(
  siteUrl: string,
  locale: Locale,
  category?: { slug: string; name: string },
) {
  const t = getDictionary(locale);
  return breadcrumbList([
    { name: t.crumbs.home, url: `${siteUrl}${localePath(locale, "/")}` },
    { name: t.crumbs.shop, url: `${siteUrl}${localePath(locale, "/shop")}` },
    ...(category
      ? [
          {
            name: stripBidiIsolates(category.name),
            url: `${siteUrl}${localePath(locale, `/shop/${category.slug}`)}`,
          },
        ]
      : []),
  ]);
}

export function productItemList(siteUrl: string, locale: Locale, list: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: list.length,
    itemListElement: list.map((product, index) => {
      const localized = localizeProduct(product, locale);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: stripBidiIsolates(localized.title),
        url: `${siteUrl}${localePath(locale, `/product/${product.slug}`)}`,
      };
    }),
  };
}

export function websiteSchema(siteUrl: string, locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: `${siteUrl}${localePath(locale, "/")}`,
    inLanguage: locale,
    description: locale === "ar" ? staticSeo.arabicHome.description : staticSeo.home.description,
    publisher: { "@id": organizationId(siteUrl) },
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
      name: site.legalName,
      url: siteUrl,
      email: site.email,
      logo: logoObject(siteUrl),
    },
    image: [`${url}/opengraph-image`],
    mainEntityOfPage: url,
  };
}

export function organizationSchema(siteUrl: string, locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(siteUrl),
    name: site.legalName,
    url: `${siteUrl}${localePath("en", "/")}`,
    logo: logoObject(siteUrl),
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dammam",
      addressCountry: "SA",
    },
    hasMerchantReturnPolicy: merchantReturnPolicy(siteUrl, locale),
  };
}
