"use client";

import { ApplePayButton } from "@/components/apple-pay-button";
import { useCart } from "@/components/cart-provider";
import { useI18n } from "@/components/locale-provider";
import { MoyasarForm } from "@/components/moyasar-form";
import { Price } from "@/components/price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProduct } from "@/data/products";
import { overlapPairs, quote, CatalogError } from "@/lib/catalog";
import { isolateEmbeds, textDir } from "@/lib/i18n/bidi";
import { localizedProduct } from "@/lib/i18n/content";
import { translateMessage } from "@/lib/i18n/messages";
import { formatMoney, formatSarAmount } from "@/lib/money";
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
  const { t, href, locale } = useI18n();
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
    paypalEnabled ? "paypal" : stripeEnabled ? "card" : moyasarEnabled ? "moyasar" : "card",
  );

  let summary: ReturnType<typeof quote> | null = null;
  let catalogError = "";
  try {
    if (slugs.length) summary = quote(slugs);
  } catch (reason) {
    catalogError = reason instanceof CatalogError ? translateMessage(locale, reason.message) : t.checkout.readError;
  }
  const warnings = summary ? overlapPairs(slugs) : [];

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!summary) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const buttonValue = submitter instanceof HTMLButtonElement ? submitter.value : "";
    const choice =
      buttonValue === "paypal" || buttonValue === "card" || buttonValue === "moyasar" ? buttonValue : providerRef.current;
    const provider =
      choice === "paypal" && paypalEnabled ? "paypal" : choice === "moyasar" && moyasarEnabled ? "moyasar" : "card";
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
        setError(translateMessage(locale, data.error || "Checkout could not start."));
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
        router.push(href(`/orders/${data.token}${data.demo ? "?demo=1" : ""}`));
        return;
      }
      setError(t.checkout.nextError);
      setPending(false);
    } catch {
      setError(t.checkout.network);
      setPending(false);
    }
  }

  if (!cart.ready && !buy) {
    return <p className="text-sm text-muted-foreground">{t.checkout.loading}</p>;
  }

  if (!summary) {
    return (
      <div className="rounded-2xl border border-dashed p-8">
        <h2 className="font-serif text-3xl">{t.checkout.emptyTitle}</h2>
        <p className="mt-2 text-muted-foreground">{catalogError || t.checkout.emptyFallback}</p>
        <Link href={href("/shop")} className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4">
          {t.checkout.returnShop}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <form id="checkout-form" onSubmit={placeOrder} className="order-2 min-w-0 space-y-6 pb-28 lg:order-1 lg:pb-0">
        {canceled ? (
          <p role="status" className="rounded-xl border border-copper/40 bg-card px-4 py-3 text-sm">
            {t.checkout.canceled}
          </p>
        ) : null}
        {paypalFailed ? (
          <p role="alert" className="rounded-xl border border-destructive/40 bg-card px-4 py-3 text-sm">
            {t.checkout.paypalFailed}
          </p>
        ) : null}
        {moyasarFailed ? (
          <p role="alert" className="rounded-xl border border-destructive/40 bg-card px-4 py-3 text-sm">
            {t.checkout.moyasarFailed}
          </p>
        ) : null}
        <div
          className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
            liveCheckout ? "bg-secondary" : "border border-copper/50 bg-card"
          }`}
        >
          {checkoutNotice(t, locale, stripeEnabled, paypalEnabled, moyasarEnabled)}
        </div>
        {warnings.map((warning) => (
          <p key={`${warning.bundle}-${warning.guide}`} role="status" className="rounded-xl border border-copper/40 px-4 py-3 text-sm">
            {t.checkout.overlap(
              localizedProduct(warning.guide, locale)?.title ?? warning.guide,
              localizedProduct(warning.bundle, locale)?.title ?? warning.bundle,
            )}
          </p>
        ))}
        <div className="space-y-2">
          <Label htmlFor="checkout-email">{t.checkout.email}</Label>
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
            {t.checkout.emailHelp}
          </p>
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {translateMessage(locale, error)}
          </p>
        ) : null}
        {status ? (
          <p role="status" className="text-sm text-muted-foreground">
            {status}
          </p>
        ) : null}
        <p className="rounded-xl border bg-card px-4 py-3 text-sm leading-relaxed">
          {t.checkout.final}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {paypalEnabled && summary ? (
            <ApplePayButton
              locale={locale}
              email={email}
              slugs={summary.lines.map((line) => line.slug)}
              amount={summary.subtotal}
              items={summary.lines.map((line) => ({
                label: localizedProduct(line.slug, locale)?.title ?? line.title,
                amount: line.price,
              }))}
              disabled={pending}
              onBusy={(busy) => {
                setPending(busy);
                if (busy) setMoyasarConfig(null);
              }}
              onPaid={(token) => {
                summary.lines.forEach((line) => cart.remove(line.slug));
                router.push(href(`/orders/${encodeURIComponent(token)}?paid=1`));
              }}
              onError={(message) => {
                setStatus("");
                setError(translateMessage(locale, message));
                setPending(false);
              }}
              onCancel={() => {
                setError("");
                setStatus(t.checkout.appleCanceled);
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
              className="wrap-button h-auto w-full px-5 py-2 sm:w-auto"
              onClick={() => {
                providerRef.current = "card";
              }}
            >
              {pending ? t.checkout.working : stripeEnabled ? t.checkout.stripe : t.checkout.demo}
            </Button>
          ) : null}
          {paypalEnabled ? (
            <Button
              type="submit"
              name="provider"
              value="paypal"
              disabled={pending}
              className="wrap-button h-auto w-full px-5 py-2 sm:w-auto"
              onClick={() => {
                providerRef.current = "paypal";
              }}
            >
              {pending ? t.checkout.working : t.checkout.paypal}
            </Button>
          ) : null}
          {moyasarEnabled ? (
            <Button
              type="submit"
              name="provider"
              value="moyasar"
              variant={stripeEnabled || paypalEnabled ? "outline" : "default"}
              disabled={pending}
              className="wrap-button h-auto w-full px-5 py-2 sm:w-auto"
              onClick={() => {
                providerRef.current = "moyasar";
              }}
            >
              <span className="flex flex-col items-start">
                <span>{pending ? t.checkout.working : t.checkout.moyasar}</span>
                <span lang="ar" dir="rtl" className="text-xs font-normal opacity-80">
                  {isolateEmbeds(t.checkout.moyasarAr)}
                </span>
              </span>
            </Button>
          ) : null}
        </div>
        {moyasarConfig ? <MoyasarForm config={moyasarConfig} /> : null}
      </form>
      <aside className="order-1 h-fit rounded-2xl border bg-card p-5 lg:order-2 lg:sticky lg:top-28">
        <h2 className="font-serif text-xl">{t.checkout.order}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {summary.lines.map((line) => {
            const product = getProduct(line.slug);
            const title = localizedProduct(line.slug, locale)?.title ?? line.title;
            return (
              <li key={line.slug} className="flex items-start justify-between gap-3">
                <span>
                  <span dir={textDir(title)}>{title}</span>
                  {product?.kind === "bundle" ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t.checkout.includes(product.includes.length)}
                    </span>
                  ) : null}
                </span>
                <Price price={line.price} compareAt={line.compareAtPrice} />
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-3 font-medium">
          <span>{t.checkout.total}</span>
          <span className="price text-end">
            <span dir="ltr">{formatMoney(summary.subtotal)}</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">
              {t.price.approx} <span dir="ltr">{formatSarAmount(summary.subtotal)}</span> {t.price.sar}
            </span>
          </span>
        </div>
        {moyasarEnabled && usdToSarRate ? (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {t.checkout.moyasarCharge(formatSarHalalas(usdToHalalas(summary.subtotal, usdToSarRate)), usdToSarRate)}
            <span className="mt-1 block" lang="ar" dir="rtl">
              {t.checkout.moyasarArNote}
            </span>
          </p>
        ) : null}
        {buy ? (
          <p className="mt-3 text-xs text-muted-foreground">{t.checkout.buyOnly}</p>
        ) : null}
      </aside>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur lg:hidden">
        <Button
          type="submit"
          form="checkout-form"
          name="provider"
          value={paypalEnabled ? "paypal" : stripeEnabled ? "card" : moyasarEnabled ? "moyasar" : "card"}
          disabled={pending}
          className="wrap-button h-auto w-full px-5 py-2"
        >
          {pending
            ? t.checkout.working
            : paypalEnabled
              ? t.checkout.paypal
              : stripeEnabled
                ? t.checkout.stripe
                : moyasarEnabled
                  ? t.checkout.moyasar
                  : t.checkout.demo}
        </Button>
      </div>
    </div>
  );
}

function checkoutNotice(
  t: ReturnType<typeof useI18n>["t"],
  locale: ReturnType<typeof useI18n>["locale"],
  stripeEnabled: boolean,
  paypalEnabled: boolean,
  moyasarEnabled: boolean,
) {
  if (!stripeEnabled && !paypalEnabled && !moyasarEnabled) return t.checkout.noticeDemo;
  if (paypalEnabled && !stripeEnabled && !moyasarEnabled) return t.checkout.noticePaypal;
  const options = [
    paypalEnabled ? t.checkout.optionPaypal : "",
    stripeEnabled ? t.checkout.optionStripe : "",
    moyasarEnabled ? t.checkout.optionMoyasar : "",
  ].filter(Boolean);
  if (options.length === 1 && stripeEnabled) return t.checkout.noticeStripe;
  return t.checkout.payWith(joinOptions(options, locale));
}

function joinOptions(options: string[], locale: "en" | "ar") {
  if (options.length === 1) return options[0];
  const or = locale === "ar" ? "أو" : "or";
  const comma = locale === "ar" ? "، " : ", ";
  if (options.length === 2) return `${options[0]} ${or} ${options[1]}`;
  return `${options.slice(0, -1).join(comma)}${or} ${options[options.length - 1]}`;
}
