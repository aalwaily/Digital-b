import { getPost, resolvePostSeo } from "@/data/blog";
import { getLegalPage } from "@/data/legal";
import {
  arabicCategorySeo,
  arabicLegacyPostSeo,
  arabicProductSeo,
  categorySeo,
  productSeo,
  staticSeo,
  type SeoEntry,
} from "@/data/page-seo";
import { getProduct } from "@/data/products";
import { blogHreflang, blogLocalesForSlug } from "@/lib/blog-index";
import type { Locale } from "@/lib/i18n/config";

export type PublicMeta = {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  absoluteTitle: true;
  index: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  languages?: Partial<Record<"en" | "ar" | "x-default", string>>;
  canonical?: boolean;
};

const englishStatic = {
  "/": "home",
  "/shop": "shop",
  "/about": "about",
  "/contact": "contact",
  "/faq": "faq",
  "/blog": "blog",
} as const satisfies Record<string, keyof typeof staticSeo>;

const arabicStatic = {
  "/": "arabicHome",
  "/shop": "arabicShop",
  "/about": "arabicAbout",
  "/contact": "arabicContact",
  "/faq": "arabicFaq",
  "/blog": "arabicBlog",
} as const satisfies Record<string, keyof typeof staticSeo>;

const englishPrivate = {
  "/cart": "cart",
  "/checkout": "checkout",
  "/checkout/success": "success",
  "/orders": "orders",
  "/404": "notFound",
} as const satisfies Record<string, keyof typeof staticSeo>;

const arabicPrivate = {
  "/cart": "arabicCart",
  "/checkout": "arabicCheckout",
  "/checkout/success": "arabicSuccess",
  "/orders": "arabicOrders",
  "/404": "arabicNotFound",
} as const satisfies Record<string, keyof typeof staticSeo>;

const arabicLegal = {
  privacy: "arabicPrivacy",
  terms: "arabicTerms",
  refunds: "arabicRefunds",
  delivery: "arabicDelivery",
} as const satisfies Record<string, keyof typeof staticSeo>;

function entry(locale: Locale, path: string, seo: SeoEntry, extra: Partial<PublicMeta> = {}): PublicMeta {
  return {
    title: seo.title,
    description: seo.description,
    path,
    locale,
    absoluteTitle: true,
    index: true,
    ...extra,
  };
}

function postSeo(slug: string, locale: Locale): SeoEntry {
  const post = getPost(slug);
  if (!post) throw new Error(`Missing journal post ${slug}`);
  if (!post.lang && locale === "ar") {
    const arabic = arabicLegacyPostSeo[slug];
    if (!arabic) throw new Error(`Missing Arabic SEO for ${slug}`);
    return arabic;
  }
  return resolvePostSeo(post);
}

/** Resolved title, description, canonical path, and hreflang for one public URL. */
export function publicMetadata(locale: Locale, path: string): PublicMeta | null {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  const privateKey = (locale === "ar" ? arabicPrivate : englishPrivate)[normalized as keyof typeof englishPrivate];
  if (privateKey) {
    return entry(locale, normalized, staticSeo[privateKey], { index: false, canonical: normalized !== "/404" });
  }

  const staticKey = (locale === "ar" ? arabicStatic : englishStatic)[normalized as keyof typeof englishStatic];
  if (staticKey) return entry(locale, normalized, staticSeo[staticKey]);

  const category = normalized.match(/^\/shop\/([^/]+)$/);
  if (category) {
    const seo = (locale === "ar" ? arabicCategorySeo : categorySeo)[category[1]];
    if (!seo) return null;
    return entry(locale, normalized, seo);
  }

  const product = normalized.match(/^\/product\/([^/]+)$/);
  if (product) {
    if (!getProduct(product[1])) return null;
    const seo = (locale === "ar" ? arabicProductSeo : productSeo)[product[1]];
    if (!seo) return null;
    return entry(locale, normalized, seo);
  }

  const legal = normalized.match(/^\/legal\/([^/]+)$/);
  if (legal) {
    const page = getLegalPage(legal[1]);
    if (!page) return null;
    const key = locale === "ar" ? arabicLegal[legal[1] as keyof typeof arabicLegal] : (legal[1] as keyof typeof staticSeo);
    const seo = key && key in staticSeo ? staticSeo[key as keyof typeof staticSeo] : undefined;
    if (!seo) return entry(locale, normalized, { title: page.title, description: page.description, keyword: page.slug });
    return entry(locale, normalized, seo);
  }

  const post = normalized.match(/^\/blog\/([^/]+)$/);
  if (post) {
    const source = getPost(post[1]);
    if (!source || !blogLocalesForSlug(post[1]).includes(locale)) return null;
    const languages = blogHreflang(post[1]) ?? undefined;
    return entry(locale, normalized, postSeo(post[1], locale), {
      type: "article",
      publishedTime: source.date,
      languages,
    });
  }

  return null;
}
