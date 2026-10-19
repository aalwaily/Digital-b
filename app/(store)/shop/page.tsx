import { ShopBrowser } from "@/components/shop-browser";
import { bundles, guides } from "@/data/products";
import { searchProducts } from "@/lib/catalog";
import { staticSeo } from "@/data/page-seo";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: staticSeo.shop.title,
  description: staticSeo.shop.description,
  path: "/shop",
});

type Search = { q?: string | string[]; category?: string | string[]; sort?: string | string[] };

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const query = first(params.q);
  const category = first(params.category) || "all";
  const sort = first(params.sort) || "featured";
  const results = searchProducts({ query, category, sort });

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-5 py-12">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Library</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">Shop the guides</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {guides.length} practical PDFs and {bundles.length} bundles. Every guide has a free sample, a table of contents, and a straight price.
      </p>
      <div className="mt-8">
        <ShopBrowser query={query} category={category} sort={sort} results={results} />
      </div>
    </div>
  );
}
