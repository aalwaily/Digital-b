"use client";

import { useCart } from "@/components/cart-provider";
import { Cover } from "@/components/cover";
import { Price } from "@/components/price";
import { Button, buttonVariants } from "@/components/ui/button";
import { getProduct } from "@/data/products";
import { quote } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import Link from "next/link";

export function CartView({ canceled = false }: { canceled?: boolean }) {
  const cart = useCart();
  const items = cart.slugs.map((slug) => getProduct(slug)).filter((item) => item !== undefined);
  const summary = items.length ? quote(items.map((item) => item.slug)) : null;

  const canceledNote = canceled ? (
    <p role="status" className="mb-6 rounded-xl border border-copper/40 bg-card px-4 py-3 text-sm">
      PayPal checkout was canceled. Nothing was charged. Your cart is still here.
    </p>
  ) : null;

  if (!cart.ready) {
    return (
      <div>
        {canceledNote}
        <p className="text-sm text-muted-foreground">Loading your cart…</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div>
        {canceledNote}
        <div className="rounded-2xl border border-dashed p-8">
          <h2 className="font-serif text-3xl">Your cart is empty</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            The library is a short walk from here. Guides are one-time purchases, delivered as PDFs.
          </p>
          <Link href="/shop" className={buttonVariants({ className: "mt-6 inline-flex h-11 px-5" })}>
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {canceledNote}
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.slug} className="flex gap-4 py-5">
              <Link href={`/product/${item.slug}`} className="w-20 shrink-0 overflow-hidden rounded-md ring-1 ring-black/10">
                <Cover product={item} decorative />
              </Link>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-xl">
                  <Link href={`/product/${item.slug}`} className="hover:underline">
                    {item.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                <button
                  type="button"
                  className="mt-2 text-sm underline underline-offset-4"
                  onClick={() => cart.remove(item.slug)}
                >
                  Remove
                </button>
              </div>
              <Price price={item.price} compareAt={item.compareAtPrice} />
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-28">
          <h2 className="font-serif text-xl">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="price">{formatMoney(summary.subtotal)}</dd>
            </div>
            {summary.savings > 0 ? (
              <div className="flex justify-between text-copper">
                <dt>Bundle savings</dt>
                <dd className="price">{formatMoney(summary.savings)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t pt-2 font-medium">
              <dt>Due today</dt>
              <dd className="price">{formatMoney(summary.subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Digital delivery. All sales are final. Prices in USD. Payments are processed by PayPal.
          </p>
          <Link href="/checkout" className={buttonVariants({ className: "mt-4 flex h-11 w-full" })}>
            Checkout
          </Link>
          <Button variant="ghost" className="mt-2 w-full" onClick={() => cart.clear()}>
            Clear cart
          </Button>
        </aside>
      </div>
    </div>
  );
}
