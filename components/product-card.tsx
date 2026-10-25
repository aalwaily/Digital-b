"use client";

import { Cover } from "@/components/cover";
import { useI18n } from "@/components/locale-provider";
import { Price } from "@/components/price";
import { PurchaseActions } from "@/components/purchase-actions";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/products";
import { pageCountFor } from "@/lib/catalog";
import { textDir } from "@/lib/i18n/bidi";
import { localizeCategory } from "@/lib/i18n/content";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const { locale, t, href } = useI18n();
  const category = localizeCategory(product.category, locale);
  const pages = pageCountFor(product);

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <Link
        href={href(`/product/${product.slug}`)}
        className="block overflow-hidden rounded-xl shadow-[0_18px_40px_-28px_rgba(28,24,18,0.7)] ring-1 ring-black/10 transition motion-safe:group-hover:-translate-y-0.5 dark:ring-white/10"
      >
        <Cover product={product} decorative />
        <span className="sr-only">{product.title}</span>
      </Link>
      <div className="mt-4 flex min-w-0 flex-1 flex-col">
        <p className="text-xs tracking-[0.16em] text-copper uppercase">{category?.name}</p>
        <h3 dir={textDir(product.title)} className="mt-1 font-serif text-2xl leading-tight">
          <Link href={href(`/product/${product.slug}`)} className="inline-flex min-h-11 items-center hover:underline">
            {product.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
          <Price price={product.price} compareAt={product.compareAtPrice} previousPrice={product.previousPrice} />
          {product.compareAtPrice ? <Badge variant="secondary">{t.product.bundleBadge}</Badge> : null}
          <span className="text-xs text-muted-foreground">{t.product.pages(pages)}</span>
        </div>
        <div className="mt-3">
          <PurchaseActions slug={product.slug} hint />
        </div>
      </div>
    </article>
  );
}
