"use client";

import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/products";
import { searchProducts } from "@/lib/catalog";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "title", label: "Title A–Z" },
];

export function ShopBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const queryParam = params.get("q") ?? "";
  const category = params.get("category") ?? "all";
  const sort = params.get("sort") ?? "featured";
  const [query, setQuery] = useState(queryParam);

  useEffect(() => {
    if (document.activeElement?.id === "shop-search") return;
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (query === queryParam) return;
    const handle = window.setTimeout(() => {
      const search = new URLSearchParams(window.location.search);
      if (query) search.set("q", query);
      else search.delete("q");
      const suffix = search.toString();
      const next = suffix ? `/shop?${suffix}` : "/shop";
      const current = `${window.location.pathname}${window.location.search}`;
      if (next !== current) router.replace(next, { scroll: false });
    }, 160);
    return () => window.clearTimeout(handle);
  }, [query, queryParam, router]);

  const results = useMemo(
    () => searchProducts({ query, category, sort }),
    [query, category, sort],
  );

  function update(next: { q?: string; category?: string; sort?: string }) {
    const search = new URLSearchParams(window.location.search);
    const merged = {
      q: next.q ?? query,
      category: next.category ?? category,
      sort: next.sort ?? sort,
    };
    if (next.q !== undefined) setQuery(next.q);
    if (merged.q) search.set("q", merged.q);
    else search.delete("q");
    if (merged.category && merged.category !== "all") search.set("category", merged.category);
    else search.delete("category");
    if (merged.sort && merged.sort !== "featured") search.set("sort", merged.sort);
    else search.delete("sort");
    const suffix = search.toString();
    router.replace(suffix ? `/shop?${suffix}` : "/shop", { scroll: false });
  }

  const activeCategory = categories.find((item) => item.slug === category);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label htmlFor="shop-search" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="shop-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guides, bundles, topics"
            className="mt-1 h-11"
          />
        </div>
        <div>
          <label htmlFor="shop-sort" className="text-sm font-medium">
            Sort
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(event) => update({ sort: event.target.value })}
            className="mt-1 h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm md:w-56"
          >
            {sorts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 w-full min-w-0 overflow-x-auto pb-1">
        <div className="flex w-max gap-2" role="toolbar" aria-label="Categories">
        <FilterButton pressed={category === "all"} onClick={() => update({ category: "all" })}>
          All
        </FilterButton>
        {categories.map((item) => (
          <FilterButton
            key={item.slug}
            pressed={category === item.slug}
            onClick={() => update({ category: item.slug })}
          >
            {item.name}
          </FilterButton>
        ))}
        </div>
      </div>

      {activeCategory ? (
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{activeCategory.description}</p>
      ) : null}

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed p-8">
          <h2 className="font-serif text-2xl">No guides match that search</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another word, or clear the filters and browse the full library.
          </p>
          <button
            type="button"
            className="mt-4 text-sm underline underline-offset-4"
            onClick={() => update({ q: "", category: "all", sort: "featured" })}
          >
            Clear filters
          </button>
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

function FilterButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`h-10 shrink-0 rounded-full px-3 text-sm ${
        pressed ? "bg-foreground text-background" : "bg-card ring-1 ring-border"
      }`}
    >
      {children}
    </button>
  );
}
