"use client";

import { useCart } from "@/components/cart-provider";
import { Price } from "@/components/price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProduct } from "@/data/products";
import { overlapWarnings, quote, CatalogError } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function CheckoutView({ stripeEnabled }: { stripeEnabled: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const cart = useCart();
  const buy = params.get("buy");
  const canceled = params.get("canceled") === "1";
  const slugs = useMemo(() => {
    if (buy) return [buy];
    return cart.slugs;
  }, [buy, cart.slugs]);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  let summary: ReturnType<typeof quote> | null = null;
  let catalogError = "";
  try {
    if (slugs.length) summary = quote(slugs);
  } catch (reason) {
    catalogError = reason instanceof CatalogError ? reason.message : "Could not read this order.";
  }
  const warnings = summary ? overlapWarnings(slugs) : [];

  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!summary) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slugs: summary.lines.map((line) => line.slug),
          email,
          confirmDemo: !stripeEnabled,
        }),
      });
      const data = (await response.json()) as { error?: string; url?: string; token?: string; demo?: boolean };
      if (!response.ok) {
        setError(data.error || "Checkout could not start.");
        setPending(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.token) {
        summary.lines.forEach((line) => cart.remove(line.slug));
        router.push(`/orders/${data.token}${data.demo ? "?demo=1" : ""}`);
        return;
      }
      setError("Checkout did not return a next step.");
      setPending(false);
    } catch {
      setError("Network error. Try again.");
      setPending(false);
    }
  }

  if (!cart.ready && !buy) {
    return <p className="text-sm text-muted-foreground">Loading checkout…</p>;
  }

  if (!summary) {
    return (
      <div className="rounded-2xl border border-dashed p-8">
        <h2 className="font-serif text-3xl">Nothing to check out</h2>
        <p className="mt-2 text-muted-foreground">{catalogError || "Add a guide before paying."}</p>
        <Link href="/shop" className="mt-4 inline-block text-sm underline underline-offset-4">
          Return to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <form onSubmit={placeOrder} className="order-2 space-y-6 lg:order-1">
        {canceled ? (
          <p role="status" className="rounded-xl border border-copper/40 bg-card px-4 py-3 text-sm">
            Checkout was canceled. Nothing was charged. Your cart is still here if you came from it.
          </p>
        ) : null}
        <div
          className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
            stripeEnabled ? "bg-secondary" : "border border-copper/50 bg-card"
          }`}
        >
          {stripeEnabled
            ? "You will continue to Stripe's hosted payment page. Vellum Press never sees your card number."
            : "Demo checkout. Stripe keys are not set, so this order is simulated. You will not be charged, and a real card form is not shown."}
        </div>
        {warnings.map((warning) => (
          <p key={warning} role="status" className="rounded-xl border border-copper/40 px-4 py-3 text-sm">
            {warning}
          </p>
        ))}
        <div className="space-y-2">
          <Label htmlFor="checkout-email">Email for the receipt</Label>
          <Input
            id="checkout-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11"
            placeholder="you@example.com"
          />
          <p className="text-xs text-muted-foreground">
            We use this for the download receipt. It is stored inside the signed link.
          </p>
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={pending} className="h-11 px-5">
          {pending ? "Working…" : stripeEnabled ? "Continue to Stripe" : "Place demo order"}
        </Button>
      </form>
      <aside className="order-1 h-fit rounded-2xl border bg-card p-5 lg:order-2 lg:sticky lg:top-28">
        <h2 className="font-serif text-xl">Your order</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {summary.lines.map((line) => {
            const product = getProduct(line.slug);
            return (
              <li key={line.slug} className="flex items-start justify-between gap-3">
                <span>
                  {line.title}
                  {product?.kind === "bundle" ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Includes {product.includes.length} guides
                    </span>
                  ) : null}
                </span>
                <Price price={line.price} compareAt={line.compareAtPrice} />
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-3 font-medium">
          <span>Total</span>
          <span className="price">{formatMoney(summary.subtotal)}</span>
        </div>
        {buy ? (
          <p className="mt-3 text-xs text-muted-foreground">Buying this guide only. Your saved cart is unchanged until the order completes.</p>
        ) : null}
      </aside>
    </div>
  );
}
