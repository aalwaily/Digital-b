"use client";

import { Cover } from "@/components/cover";
import { Price } from "@/components/price";
import { PurchaseActions } from "@/components/purchase-actions";
import { Badge } from "@/components/ui/badge";
import { getCategory, type Product } from "@/data/products";
import { pageCountFor } from "@/lib/catalog";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const pages = pageCountFor(product);

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="block overflow-hidden rounded-xl shadow-[0_18px_40px_-28px_rgba(28,24,18,0.7)] ring-1 ring-black/10 transition motion-safe:group-hover:-translate-y-0.5 dark:ring-white/10"
        aria-label={product.title}
      >
        <Cover product={product} decorative />
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs tracking-[0.16em] text-copper uppercase">{category?.name}</p>
        <h3 className="mt-1 font-serif text-2xl leading-tight">
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-3 flex items-center gap-2">
          <Price price={product.price} compareAt={product.compareAtPrice} />
          {product.compareAtPrice ? <Badge variant="secondary">Bundle</Badge> : null}
          <span className="text-xs text-muted-foreground">{pages} pages</span>
        </div>
        <div className="mt-3">
          <PurchaseActions slug={product.slug} />
        </div>
      </div>
    </article>
  );
}
