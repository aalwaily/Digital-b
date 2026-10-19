"use client";

import { useI18n } from "@/components/locale-provider";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import type { Product } from "@/data/products";
import { localizedCategories } from "@/lib/i18n/content";
import Link from "next/link";
import type { ReactNode } from "react";

export function ShopBrowser({
  query,
  category,
  sort,
  results,
}: {
  query: string;
  category: string;
  sort: string;
  results: Product[];
}) {
  const { t, href, locale } = useI18n();
  const categories = localizedCategories(locale);
  const activeCategory = categories.find((item) => item.slug === category);
  const sorts = [
    { id: "featured", label: t.shop.sorts.featured },
    { id: "newest", label: t.shop.sorts.newest },
    { id: "price-asc", label: t.shop.sorts["price-asc"] },
    { id: "price-desc", label: t.shop.sorts["price-desc"] },
    { id: "title", label: t.shop.sorts.title },
  ];

  return (
    <div className="min-w-0">
      <form action={href("/shop")} method="get" className="flex flex-col gap-3 md:flex-row md:items-end">
        {category !== "all" ? <input type="hidden" name="category" value={category} /> : null}
        <div className="min-w-0 flex-1">
          <label htmlFor="shop-search" className="text-sm font-medium">
            {t.shop.search}
          </label>
          <Input
            id="shop-search"
            type="search"
            name="q"
            defaultValue={query}
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
            defaultValue={sort}
            className="mt-1 h-11 w-full max-w-full rounded-lg border border-input bg-transparent px-3 text-sm md:w-56"
          >
            {sorts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="h-11 rounded-lg bg-foreground px-4 text-sm text-background"
        >
          {t.shop.apply}
        </button>
      </form>

      <div className="mt-5 w-full min-w-0 max-w-full overflow-x-auto pb-1">
        <div className="flex w-max gap-2" role="toolbar" aria-label={t.shop.categories}>
          <FilterLink href={shopHref(href, { q: query, category: "all", sort })} pressed={category === "all"}>
            {t.shop.all}
          </FilterLink>
          {categories.map((item) => (
            <FilterLink
              key={item.slug}
              href={shopHref(href, { q: query, category: item.slug, sort })}
              pressed={category === item.slug}
            >
              {item.name}
            </FilterLink>
          ))}
        </div>
      </div>

      {activeCategory ? (
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{activeCategory.description}</p>
      ) : null}

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed p-8">
          <h2 className="font-serif text-2xl">{t.shop.emptyTitle}</h2>
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
      className={`inline-flex h-11 shrink-0 items-center rounded-full px-3 text-sm ${
        pressed ? "bg-foreground text-background" : "bg-card ring-1 ring-border"
      }`}
    >
      {children}
    </Link>
  );
}
