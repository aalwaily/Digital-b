import { arCategories, arProducts, type ProductCopy } from "@/lib/i18n/ar-catalog";
import { arFaqs, arLegal, arPosts } from "@/lib/i18n/ar-pages";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPost, posts, type Post } from "@/data/blog";
import { faqs, type FaqItem } from "@/data/faq";
import { getLegalPage, legalPages, type LegalPage } from "@/data/legal";
import { categories, getCategory, getProduct, products, type Product } from "@/data/products";
import { notFound } from "next/navigation";

export function requireLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export function localizeCategory(slug: string, locale: Locale) {
  const category = getCategory(slug);
  if (!category) return undefined;
  if (locale === "en") return category;
  const copy = arCategories[slug];
  if (!copy) return category;
  return { ...category, name: copy.name, description: copy.description };
}

export function localizedCategories(locale: Locale) {
  return categories.map((category) => localizeCategory(category.slug, locale) ?? category);
}

export function localizeProduct<T extends Product>(product: T, locale: Locale): T {
  if (locale === "en") return product;
  const copy: ProductCopy | undefined = arProducts[product.slug];
  if (!copy) return product;
  return {
    ...product,
    title: copy.title,
    subtitle: copy.subtitle,
    shortDescription: copy.shortDescription,
    description: copy.description,
    included: copy.included,
    contents: copy.contents,
    faqs: copy.faqs,
    cover: { ...product.cover, ...copy.cover },
  };
}

export function localizedProduct(slug: string, locale: Locale) {
  const product = getProduct(slug);
  return product ? localizeProduct(product, locale) : undefined;
}

export function localizedProducts(locale: Locale) {
  return products.map((product) => localizeProduct(product, locale));
}

export function localizeFaqs(locale: Locale): FaqItem[] {
  return locale === "ar" ? arFaqs : faqs;
}

export function localizeLegal(page: LegalPage, locale: Locale): LegalPage {
  if (locale === "en") return page;
  const copy = arLegal[page.slug];
  if (!copy) return page;
  return { ...page, title: copy.title, description: copy.description, sections: copy.sections };
}

export function localizedLegal(slug: string, locale: Locale) {
  const page = getLegalPage(slug);
  return page ? localizeLegal(page, locale) : undefined;
}

export function localizePost(post: Post, locale: Locale): Post {
  if (locale === "en") return post;
  const copy = arPosts[post.slug];
  if (!copy) return post;
  return { ...post, ...copy };
}

export function localizedPost(slug: string, locale: Locale) {
  const post = getPost(slug);
  return post ? localizePost(post, locale) : undefined;
}

export function localizedPosts(locale: Locale) {
  return posts.map((post) => localizePost(post, locale));
}

export function formatLongDate(iso: string, locale: Locale) {
  const date = new Date(iso.includes("T") ? iso : `${iso}T00:00:00.000Z`);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

export function allPublicPaths() {
  const paths = ["/", "/shop", "/about", "/contact", "/faq", "/blog"];
  for (const product of products) paths.push(`/product/${product.slug}`);
  for (const post of posts) paths.push(`/blog/${post.slug}`);
  for (const page of legalPages) paths.push(`/legal/${page.slug}`);
  return paths;
}
