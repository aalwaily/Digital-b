import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLdList } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { categories } from "@/data/products";
import { localePath } from "@/lib/i18n/config";
import { localizeCategory, localizeProduct, requireLocale } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageJsonLd, productsInCategory } from "@/lib/page-jsonld";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { locale: string; category: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: raw, category } = await params;
  const locale = requireLocale(raw);
  const meta = publicMetadata(locale, `/shop/${category}`);
  if (!meta) return { title: "Shop" };
  return pageMetadata(meta);
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { locale: raw, category: slug } = await params;
  const locale = requireLocale(raw);
  const category = localizeCategory(slug, locale);
  if (!category) notFound();
  const t = getDictionary(locale);
  const list = productsInCategory(slug).map((product) => localizeProduct(product, locale));

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-5 sm:px-5 sm:py-12">
      <JsonLdList data={pageJsonLd(locale, `/shop/${slug}`)} />
      <Breadcrumbs
        label={t.product.breadcrumb}
        locale={locale}
        items={[
          { href: localePath(locale, "/"), label: t.crumbs.home },
          { href: localePath(locale, "/shop"), label: t.crumbs.shop },
          { label: category.name },
        ]}
      />
      <p className="mt-3 text-xs tracking-[0.16em] text-copper uppercase sm:mt-6 sm:tracking-[0.18em]">{t.shop.eyebrow}</p>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{category.description}</p>
      <div className="mt-4 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
        {list.map((product) => (
          <ProductCard key={product.slug} product={product} locale={locale} layout="responsive" />
        ))}
      </div>
    </div>
  );
}
