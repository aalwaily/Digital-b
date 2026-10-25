"use client";

import { useI18n } from "@/components/locale-provider";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import type { ShopListing } from "@/lib/catalog";
import { localizedCategories } from "@/lib/i18n/content";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";

const DEFAULT_QUERY = { query: "", category: "all", sort: "featured" };

export function ShopBrowser({ listings }: { listings: ShopListing[] }) {
  return (
    <Suspense fallback={<ShopControls listings={listings} query={DEFAULT_QUERY} />}>
      <ShopFiltered listings={listings} />
    </Suspense>
  );
}

function ShopFiltered({ listings }: { listings: ShopListing[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(DEFAULT_QUERY);
  useEffect(() => {
    const next = {
      query: params.get("q") ?? "",
      category: params.get("category") || "all",
      sort: params.get("sort") || "featured",
    };
    setQuery((current) =>
      current.query === next.query && current.category === next.category && current.sort === next.sort ? current : next,
    );
  }, [params]);
  return <ShopControls listings={listings} query={query} />;
}

function ShopControls({
  listings,
  query,
}: {
  listings: ShopListing[];
  query: { query: string; category: string; sort: string };
}) {
  const { t, href, locale } = useI18n();
  const categories = localizedCategories(locale);
  const activeCategory = categories.find((item) => item.slug === query.category);
  const sorts = [
    { id: "featured", label: t.shop.sorts.featured },
    { id: "newest", label: t.shop.sorts.newest },
    { id: "price-asc", label: t.shop.sorts["price-asc"] },
    { id: "price-desc", label: t.shop.sorts["price-desc"] },
    { id: "title", label: t.shop.sorts.title },
  ];
  const results = useMemo(() => filterListings(listings, query, locale), [listings, query, locale]);

  return (
    <div className="min-w-0">
      <form
        key={`${query.query}|${query.category}|${query.sort}`}
        action={href("/shop")}
        method="get"
        className="flex flex-col gap-3 md:flex-row md:items-end"
      >
        {query.category !== "all" ? <input type="hidden" name="category" value={query.category} /> : null}
        <div className="min-w-0 flex-1">
          <label htmlFor="shop-search" className="text-sm font-medium">
            {t.shop.search}
          </label>
          <Input
            id="shop-search"
            type="search"
            name="q"
            defaultValue={query.query}
            placeholder={t.shop.placeholder}
            className="mt-1 h-11"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="shop-sort" className="text-sm font-medium">
            {t.shop.sort}
          </label>
          <select
            id="shop-sort"
            name="sort"
            defaultValue={query.sort}
            className="mt-1 h-11 w-full max-w-full rounded-lg border border-input bg-transparent px-3 text-start text-base md:w-56"
          >
            {sorts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="h-11 rounded-lg bg-foreground px-4 text-sm text-background">
          {t.shop.apply}
        </button>
      </form>

      <div className="mt-5 flex min-w-0 flex-wrap gap-2" role="toolbar" aria-label={t.shop.categories}>
        <FilterLink href={shopHref(href, { q: query.query, category: "all", sort: query.sort })} pressed={query.category === "all"}>
          {t.shop.all}
        </FilterLink>
        {categories.map((item) => (
          <FilterLink
            key={item.slug}
            href={shopHref(href, { q: query.query, category: item.slug, sort: query.sort })}
            pressed={query.category === item.slug}
          >
            {item.name}
          </FilterLink>
        ))}
      </div>

      {activeCategory ? <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{activeCategory.description}</p> : null}

      <h2 className="sr-only">{t.shop.results}</h2>
      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed p-8">
          <h3 className="font-serif text-2xl">{t.shop.emptyTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t.shop.emptyText}</p>
          <Link href={href("/shop")} className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4">
            {t.shop.clear}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function filterListings(
  listings: ShopListing[],
  query: { query: string; category: string; sort: string },
  locale: string,
) {
  const needle = query.query.trim().toLowerCase();
  const category = query.category !== "all" ? query.category : null;
  const indexed = listings.map((entry, index) => ({ ...entry, index }));
  let list = indexed.filter((entry) => {
    if (category && entry.product.category !== category) return false;
    if (!needle) return true;
    return entry.searchText.includes(needle);
  });
  const sort = query.sort;
  if (sort === "price-asc") list = [...list].sort((a, b) => a.product.price - b.product.price);
  else if (sort === "price-desc") list = [...list].sort((a, b) => b.product.price - a.product.price);
  else if (sort === "title")
    list = [...list].sort((a, b) => a.product.title.localeCompare(b.product.title, locale));
  else if (sort === "newest") list = [...list].sort((a, b) => b.product.published.localeCompare(a.product.published));
  else list = [...list].sort((a, b) => a.index - b.index);
  return list.map((entry) => entry.product);
}

function shopHref(href: (path: string) => string, { q, category, sort }: { q: string; category: string; sort: string }) {
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (category && category !== "all") search.set("category", category);
  if (sort && sort !== "featured") search.set("sort", sort);
  const suffix = search.toString();
  return href(suffix ? `/shop?${suffix}` : "/shop");
}

function FilterLink({
  href,
  pressed,
  children,
}: {
  href: string;
  pressed: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={pressed ? "page" : undefined}
      className={`inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full px-3 text-sm ${
        pressed ? "bg-foreground text-background" : "bg-card ring-1 ring-border"
      }`}
    >
      {children}
    </Link>
  );
}
