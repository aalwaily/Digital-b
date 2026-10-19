import { ShopBrowser } from "@/components/shop-browser";
import { bundles, guides } from "@/data/products";
import { searchProducts } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizeProduct, requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";

type Search = { q?: string | string[]; category?: string | string[]; sort?: string | string[] };

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  return pageMetadata({
    title: t.shop.metaTitle,
    description: t.shop.metaDescription,
    path: "/shop",
    locale,
  });
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const queryParams = await searchParams;
  const query = first(queryParams.q);
  const category = first(queryParams.category) || "all";
  const sort = first(queryParams.sort) || "featured";
  const results = searchProducts({ query, category, sort, locale }).map((product) => localizeProduct(product, locale));

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-5 py-12">
      <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.shop.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{t.shop.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t.shop.lede(guides.length, bundles.length)}</p>
      <div className="mt-8 min-w-0">
        <ShopBrowser query={query} category={category} sort={sort} results={results} />
      </div>
    </div>
  );
}
