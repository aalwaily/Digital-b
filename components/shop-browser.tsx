import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { categories, type Product } from "@/data/products";
import Link from "next/link";
import type { ReactNode } from "react";

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "title", label: "Title A–Z" },
];

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
  const activeCategory = categories.find((item) => item.slug === category);

  return (
    <div>
      <form action="/shop" method="get" className="flex flex-col gap-3 md:flex-row md:items-end">
        {category !== "all" ? <input type="hidden" name="category" value={category} /> : null}
        <div className="flex-1">
          <label htmlFor="shop-search" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="shop-search"
            type="search"
            name="q"
            defaultValue={query}
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
            name="sort"
            defaultValue={sort}
            className="mt-1 h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm md:w-56"
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
          Apply
        </button>
      </form>

      <div className="mt-5 w-full min-w-0 overflow-x-auto pb-1">
        <div className="flex w-max gap-2" role="toolbar" aria-label="Categories">
          <FilterLink href={shopHref({ q: query, category: "all", sort })} pressed={category === "all"}>
            All
          </FilterLink>
          {categories.map((item) => (
            <FilterLink
              key={item.slug}
              href={shopHref({ q: query, category: item.slug, sort })}
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
          <h2 className="font-serif text-2xl">No guides match that search</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another word, or clear the filters and browse the full library.
          </p>
          <Link href="/shop" className="mt-4 inline-block text-sm underline underline-offset-4">
            Clear filters
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

function shopHref({ q, category, sort }: { q: string; category: string; sort: string }) {
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (category && category !== "all") search.set("category", category);
  if (sort && sort !== "featured") search.set("sort", sort);
  const suffix = search.toString();
  return suffix ? `/shop?${suffix}` : "/shop";
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
      className={`inline-flex h-10 shrink-0 items-center rounded-full px-3 text-sm ${
        pressed ? "bg-foreground text-background" : "bg-card ring-1 ring-border"
      }`}
    >
      {children}
    </Link>
  );
}
