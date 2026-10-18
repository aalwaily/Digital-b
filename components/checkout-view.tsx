"use client";

import { ApplePayButton } from "@/components/apple-pay-button";
import { useCart } from "@/components/cart-provider";
import { MoyasarForm } from "@/components/moyasar-form";
import { Price } from "@/components/price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProduct } from "@/data/products";
import { overlapWarnings, quote, CatalogError } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { formatSarHalalas, usdToHalalas, type MoyasarFormConfig } from "@/lib/moyasar-amount";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export function CheckoutView({
  stripeEnabled,
  paypalEnabled,
  moyasarEnabled = false,
  usdToSarRate = null,
}: {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  moyasarEnabled?: boolean;
  usdToSarRate?: string | null;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const cart = useCart();
  const buy = params.get("buy");
  const canceled = params.get("canceled") === "1";
  const paypalFailed = params.get("paypal") === "failed";
  const moyasarFailed = params.get("moyasar") === "failed";
  const liveCheckout = stripeEnabled || paypalEnabled || moyasarEnabled;
  const slugs = useMemo(() => {
    if (buy) return [buy];
    return cart.slugs;
  }, [buy, cart.slugs]);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [moyasarConfig, setMoyasarConfig] = useState<MoyasarFormConfig | null>(null);
  const providerRef = useRef<"card" | "paypal" | "moyasar">(
    stripeEnabled || (!paypalEnabled && !moyasarEnabled) ? "card" : paypalEnabled ? "paypal" : "moyasar",
  );

  let summary: ReturnType<typeof quote> | null = null;
  let catalogError = "";
  try {
    if (slugs.length) summary = quote(slugs);
  } catch (reason) {
    catalogError = reason instanceof CatalogError ? reason.message : "Could not read this order.";
  }
  const warnings = summary ? overlapWarnings(slugs) : [];

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!summary) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const buttonValue = submitter instanceof HTMLButtonElement ? submitter.value : "";
    const choice =
      buttonValue === "paypal" || buttonValue === "card" || buttonValue === "moyasar" ? buttonValue : providerRef.current;
    const provider = choice === "paypal" && paypalEnabled ? "paypal" : choice === "moyasar" && moyasarEnabled ? "moyasar" : "card";
    setPending(true);
    setError("");
    setStatus("");
    if (provider !== "moyasar") setMoyasarConfig(null);
    try {
      const response = await fetch(
        provider === "paypal" ? "/api/paypal/checkout" : provider === "moyasar" ? "/api/moyasar/session" : "/api/checkout",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slugs: summary.lines.map((line) => line.slug),
            email,
            confirmDemo: provider === "card" && !stripeEnabled,
          }),
        },
      );
      const data = (await response.json()) as {
        error?: string;
        url?: string;
        token?: string;
        demo?: boolean;
      } & Partial<MoyasarFormConfig>;
      if (!response.ok) {
        setError(data.error || "Checkout could not start.");
        setPending(false);
        return;
      }
      if (provider === "moyasar" && data.publishableKey && data.callbackUrl && data.amount) {
        setMoyasarConfig(data as MoyasarFormConfig);
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
        {paypalFailed ? (
          <p role="alert" className="rounded-xl border border-destructive/40 bg-card px-4 py-3 text-sm">
            PayPal could not confirm this payment, so the downloads were not released. If PayPal shows a completed
            payment, email support with the time of the charge and we will match it.
          </p>
        ) : null}
        {moyasarFailed ? (
          <p role="alert" className="rounded-xl border border-destructive/40 bg-card px-4 py-3 text-sm">
            Moyasar could not confirm this payment, so the downloads were not released. If mada, your card, Apple Pay,
            or STC Pay shows a completed charge, email support with the time of the payment and we will match it.
          </p>
        ) : null}
        <div
          className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
            liveCheckout ? "bg-secondary" : "border border-copper/50 bg-card"
          }`}
        >
          {checkoutNotice(stripeEnabled, paypalEnabled, moyasarEnabled)}
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
        {status ? (
          <p role="status" className="text-sm text-muted-foreground">
            {status}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          {paypalEnabled && summary ? (
            <ApplePayButton
              email={email}
              slugs={summary.lines.map((line) => line.slug)}
              amount={summary.subtotal}
              items={summary.lines.map((line) => ({ label: line.title, amount: line.price }))}
              disabled={pending}
              onBusy={(busy) => {
                setPending(busy);
                if (busy) setMoyasarConfig(null);
              }}
              onPaid={(token) => {
                summary.lines.forEach((line) => cart.remove(line.slug));
                router.push(`/orders/${encodeURIComponent(token)}?paid=1`);
              }}
              onError={(message) => {
                setStatus("");
                setError(message);
                setPending(false);
              }}
              onCancel={() => {
                setError("");
                setStatus("Apple Pay was canceled. Nothing was charged.");
                setPending(false);
              }}
            />
          ) : null}
          {stripeEnabled || (!paypalEnabled && !moyasarEnabled) ? (
            <Button
              type="submit"
              name="provider"
              value="card"
              disabled={pending}
              className="h-11 px-5"
              onClick={() => {
                providerRef.current = "card";
              }}
            >
              {pending ? "Working…" : stripeEnabled ? "Continue to Stripe" : "Place demo order"}
            </Button>
          ) : null}
          {paypalEnabled ? (
            <Button
              type="submit"
              name="provider"
              value="paypal"
              variant={stripeEnabled ? "outline" : "default"}
              disabled={pending}
              className="h-11 px-5"
              onClick={() => {
                providerRef.current = "paypal";
              }}
            >
              {pending ? "Working…" : "Pay with PayPal"}
            </Button>
          ) : null}
          {moyasarEnabled ? (
            <Button
              type="submit"
              name="provider"
              value="moyasar"
              variant={stripeEnabled || paypalEnabled ? "outline" : "default"}
              disabled={pending}
              className="h-auto min-h-11 whitespace-normal px-5 py-2"
              onClick={() => {
                providerRef.current = "moyasar";
              }}
            >
              <span className="flex flex-col items-start">
                <span>{pending ? "Working…" : "Pay with mada / card / Apple Pay / STC Pay"}</span>
                <span lang="ar" dir="rtl" className="text-xs font-normal opacity-80">
                  مدى · بطاقة · Apple Pay · STC Pay
                </span>
              </span>
            </Button>
          ) : null}
        </div>
        {moyasarConfig ? <MoyasarForm config={moyasarConfig} /> : null}
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
        {moyasarEnabled && usdToSarRate ? (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Moyasar charges{" "}
            <span className="price text-foreground">{formatSarHalalas(usdToHalalas(summary.subtotal, usdToSarRate))}</span>{" "}
            before you pay. USD 1 = SAR {usdToSarRate}.
            <span className="mt-1 block" lang="ar" dir="rtl">
              المبلغ بالريال السعودي
            </span>
          </p>
        ) : null}
        {buy ? (
          <p className="mt-3 text-xs text-muted-foreground">Buying this guide only. Your saved cart is unchanged until the order completes.</p>
        ) : null}
      </aside>
    </div>
  );
}

function checkoutNotice(stripeEnabled: boolean, paypalEnabled: boolean, moyasarEnabled: boolean) {
  const options = [
    stripeEnabled ? "a card on Stripe" : "",
    paypalEnabled ? "PayPal" : "",
    paypalEnabled ? "Apple Pay through PayPal on Safari" : "",
    moyasarEnabled ? "mada, Visa, Mastercard, Apple Pay, or STC Pay through Moyasar, charged in SAR" : "",
  ].filter(Boolean);
  if (options.length === 0) {
    return "Demo checkout. Stripe, PayPal, and Moyasar are not configured, so this order is simulated. You will not be charged, and a real payment form is not shown.";
  }
  if (options.length === 1 && stripeEnabled) {
    return "You will continue to Stripe's hosted payment page. Vellum Press never sees your card number.";
  }
  if (options.length === 2 && paypalEnabled && !stripeEnabled && !moyasarEnabled) {
    return "You will continue to PayPal to approve this payment, or you can use Apple Pay on Safari. Vellum Press never sees your PayPal password. The receipt is issued only after PayPal confirms the capture.";
  }
  return `Pay with ${joinOptions(options)}. Vellum Press never sees your card number or your PayPal password. The receipt is issued only after the payment is confirmed.`;
}

function joinOptions(options: string[]) {
  if (options.length === 1) return options[0];
  if (options.length === 2) return `${options[0]} or ${options[1]}`;
  return `${options.slice(0, -1).join(", ")}, or ${options[options.length - 1]}`;
}
