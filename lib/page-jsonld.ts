import { getPost, type Post } from "@/data/blog";
import { getCategory, getProduct, products, type Product } from "@/data/products";
import { blogLocalesForSlug } from "@/lib/blog-index";
import { stripBidiIsolates } from "@/lib/i18n/bidi";
import { localizeCategory, localizePost, localizeProduct, visibleHomeFaqs, localizeFaqs } from "@/lib/i18n/content";
import { localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  articleSchema,
  breadcrumbList,
  breadcrumbSchema,
  catalogBreadcrumb,
  faqSchema,
  organizationSchema,
  productItemList,
  productSchema,
  websiteSchema,
} from "@/lib/schema";
import { CANONICAL_ORIGIN } from "@/lib/seo";

function journalCrumb(locale: Locale, post: Post) {
  const t = getDictionary(locale);
  return breadcrumbList([
    { name: t.crumbs.home, url: `${CANONICAL_ORIGIN}${localePath(locale, "/")}` },
    { name: t.nav.journal, url: `${CANONICAL_ORIGIN}${localePath(locale, "/blog")}` },
    {
      name: stripBidiIsolates(post.title),
      url: `${CANONICAL_ORIGIN}${localePath(locale, `/blog/${post.slug}`)}`,
    },
  ]);
}

/**
 * JSON-LD for one indexable page. FAQPage is included only for the homepage
 * slice, the FAQ page, and a product page — the three places the questions
 * are rendered. No review or aggregateRating data is emitted.
 */
export function pageJsonLd(locale: Locale, path: string): unknown[] {
  if (path === "/") {
    return [
      websiteSchema(CANONICAL_ORIGIN, locale),
      organizationSchema(CANONICAL_ORIGIN, locale),
      faqSchema(visibleHomeFaqs(locale)),
    ];
  }

  if (path === "/shop") {
    return [catalogBreadcrumb(CANONICAL_ORIGIN, locale), productItemList(CANONICAL_ORIGIN, locale, products)];
  }

  const category = path.match(/^\/shop\/([^/]+)$/);
  if (category && getCategory(category[1])) {
    const localized = localizeCategory(category[1], locale);
    if (!localized) return [];
    const list = products.filter((product) => product.category === category[1]);
    return [
      catalogBreadcrumb(CANONICAL_ORIGIN, locale, localized),
      productItemList(CANONICAL_ORIGIN, locale, list),
    ];
  }

  const productMatch = path.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    const product = getProduct(productMatch[1]);
    if (!product) return [];
    return [
      productSchema(product, CANONICAL_ORIGIN, locale),
      faqSchema(localizeProduct(product, locale).faqs),
      breadcrumbSchema(CANONICAL_ORIGIN, product, locale),
    ];
  }

  if (path === "/faq") return [faqSchema(localizeFaqs(locale))];

  const postMatch = path.match(/^\/blog\/([^/]+)$/);
  if (postMatch) {
    const source = getPost(postMatch[1]);
    if (!source || !blogLocalesForSlug(postMatch[1]).includes(locale)) return [];
    const post = localizePost(source, locale);
    return [articleSchema(post, CANONICAL_ORIGIN, locale), journalCrumb(locale, post)];
  }

  return [];
}

export function jsonLdTypes(data: unknown[]) {
  return data.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || !("@type" in entry)) return [];
    const type = (entry as { "@type": string | string[] })["@type"];
    return Array.isArray(type) ? type : [type];
  });
}

export function productsInCategory(slug: string): Product[] {
  return products.filter((product) => product.category === slug);
}
