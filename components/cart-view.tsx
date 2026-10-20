"use client";

import { useCart } from "@/components/cart-provider";
import { Cover } from "@/components/cover";
import { useI18n } from "@/components/locale-provider";
import { Price } from "@/components/price";
import { Button, buttonVariants } from "@/components/ui/button";
import { quote } from "@/lib/catalog";
import { textDir } from "@/lib/i18n/bidi";
import { formatMoney, formatSarAmount } from "@/lib/money";
import { localizedProduct } from "@/lib/i18n/content";
import Link from "next/link";

export function CartView({ canceled = false }: { canceled?: boolean }) {
  const cart = useCart();
  const { t, href, locale } = useI18n();
  const items = cart.slugs
    .map((slug) => localizedProduct(slug, locale))
    .filter((item) => item !== undefined);
  const summary = items.length ? quote(items.map((item) => item.slug)) : null;

  const canceledNote = canceled ? (
    <p role="status" className="mb-6 rounded-xl border border-copper/40 bg-card px-4 py-3 text-sm">
      {t.cartPage.canceled}
    </p>
  ) : null;

  if (!cart.ready) {
    return (
      <div>
        {canceledNote}
        <p className="text-sm text-muted-foreground">{t.cartPage.loading}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div>
        {canceledNote}
        <div className="rounded-2xl border border-dashed p-8">
          <h2 className="font-serif text-3xl">{t.cartPage.emptyTitle}</h2>
          <p className="mt-2 max-w-md text-muted-foreground">{t.cartPage.emptyText}</p>
          <Link href={href("/shop")} className={buttonVariants({ className: "mt-6 inline-flex h-11 px-5" })}>
            {t.cartPage.browse}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      {canceledNote}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ul className="min-w-0 divide-y">
          {items.map((item) => (
            <li key={item.slug} className="flex min-w-0 gap-4 py-5">
              <Link href={href(`/product/${item.slug}`)} className="w-20 shrink-0 overflow-hidden rounded-md ring-1 ring-black/10">
                <Cover product={item} decorative />
              </Link>
              <div className="min-w-0 flex-1">
                <h2 dir={textDir(item.title)} className="font-serif text-xl">
                  <Link href={href(`/product/${item.slug}`)} className="hover:underline">
                    {item.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                <button
                  type="button"
                  className="mt-2 inline-flex min-h-11 items-center text-sm underline underline-offset-4"
                  onClick={() => cart.remove(item.slug)}
                >
                  {t.cartPage.remove}
                </button>
              </div>
              <Price price={item.price} compareAt={item.compareAtPrice} previousPrice={item.previousPrice} />
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-28">
          <h2 className="font-serif text-xl">{t.cartPage.summary}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt>{t.cartPage.subtotal}</dt>
              <dd dir="ltr" className="price text-end">
                {formatMoney(summary.subtotal)}
              </dd>
            </div>
            {summary.savings > 0 ? (
              <div className="flex justify-between gap-3 text-copper">
                <dt>{t.cartPage.savings}</dt>
                <dd dir="ltr" className="price text-end">
                  {formatMoney(summary.savings)}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3 border-t pt-2 font-medium">
              <dt>{t.cartPage.due}</dt>
              <dd className="price text-end">
                <span dir="ltr">{formatMoney(summary.subtotal)}</span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  {t.price.approx} <span dir="ltr">{formatSarAmount(summary.subtotal)}</span> {t.price.sar}
                </span>
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">{t.cartPage.note}</p>
          <Link href={href("/checkout")} className={buttonVariants({ className: "mt-4 flex h-11 w-full" })}>
            {t.cartPage.checkout}
          </Link>
          <Button variant="ghost" className="mt-2 h-11 w-full" onClick={() => cart.clear()}>
            {t.cartPage.clear}
          </Button>
        </aside>
      </div>
    </div>
  );
}
