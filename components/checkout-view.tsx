"use client";

import { useCart } from "@/components/cart-provider";
import { useCheckoutOptions } from "@/components/checkout-options";
import { useI18n } from "@/components/locale-provider";
import { MoyasarForm } from "@/components/moyasar-form";
import { PaymentSoon } from "@/components/payment-soon";
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

export function CheckoutView({ usdToSarRate = null }: { usdToSarRate?: string | null }) {
  const params = useSearchParams();
  const router = useRouter();
  const cart = useCart();
  const { t, href, locale } = useI18n();
  const { stripe: stripeEnabled, moyasar: moyasarEnabled, hala: halaEnabled, open } = useCheckoutOptions();
  const buy = params.get("buy");
  const canceled = params.get("canceled") === "1";
  const moyasarFailed = params.get("moyasar") === "failed";
  const slugs = useMemo(() => {
    if (buy) return [buy];
    return cart.slugs;
  }, [buy, cart.slugs]);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [moyasarConfig, setMoyasarConfig] = useState<MoyasarFormConfig | null>(null);
  const providerRef = useRef<"card" | "moyasar" | "hala">(
    halaEnabled ? "hala" : stripeEnabled ? "card" : "moyasar",
  );
  const stickyProvider = halaEnabled ? "hala" : stripeEnabled ? "card" : "moyasar";

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
    if (!summary || !open) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const buttonValue = submitter instanceof HTMLButtonElement ? submitter.value : "";
    const choice = buttonValue === "card" || buttonValue === "moyasar" || buttonValue === "hala" ? buttonValue : providerRef.current;
    const provider =
      choice === "hala" && halaEnabled ? "hala" : choice === "moyasar" && moyasarEnabled ? "moyasar" : "card";
    setPending(true);
    setError("");
    setStatus("");
    if (provider !== "moyasar") setMoyasarConfig(null);
    try {
      const response = await fetch(
        provider === "hala" ? "/api/hala/checkout" : provider === "moyasar" ? "/api/moyasar/session" : "/api/checkout",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slugs: summary.lines.map((line) => line.slug),
            email,
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
      <form
        id="checkout-form"
        onSubmit={placeOrder}
        className={`order-2 min-w-0 space-y-6 lg:order-1 ${open ? "pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-0" : ""}`}
      >
        {canceled ? (
          <p role="status" className="rounded-xl border border-copper/40 bg-card px-4 py-3 text-sm">
            {t.checkout.canceled}
          </p>
        ) : null}
        {moyasarFailed ? (
          <p role="alert" className="rounded-xl border border-destructive/40 bg-card px-4 py-3 text-sm">
            {t.checkout.moyasarFailed}
          </p>
        ) : null}
        {open ? (
          <div className="rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed">
            {checkoutNotice(t, locale, stripeEnabled, moyasarEnabled, halaEnabled)}
          </div>
        ) : (
          <PaymentSoon slugs={summary.lines.map((line) => line.slug)} />
        )}
        {warnings.map((warning) => (
          <p key={`${warning.bundle}-${warning.guide}`} role="status" className="rounded-xl border border-copper/40 px-4 py-3 text-sm">
            {t.checkout.overlap(
              localizedProduct(warning.guide, locale)?.title ?? warning.guide,
              localizedProduct(warning.bundle, locale)?.title ?? warning.bundle,
            )}
          </p>
        ))}
        {open ? (
          <div className="space-y-2">
            <Label htmlFor="checkout-email">{t.checkout.email}</Label>
            <Input
              id="checkout-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 text-base"
              placeholder="you@example.com"
            />
            <p className="text-xs text-muted-foreground">{t.checkout.emailHelp}</p>
          </div>
        ) : null}
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
        <p className="rounded-xl border bg-card px-4 py-3 text-sm leading-relaxed">{t.checkout.final}</p>
        {open ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {halaEnabled ? (
              <Button
                type="submit"
                name="provider"
                value="hala"
                disabled={pending}
                className="wrap-button h-auto min-h-11 w-full px-5 py-2 sm:w-auto"
                onClick={() => {
                  providerRef.current = "hala";
                }}
              >
                <span className="flex flex-col items-start">
                  <span>{pending ? t.checkout.working : t.checkout.hala}</span>
                  <span lang="ar" dir="rtl" className="text-xs font-normal opacity-80">
                    {isolateEmbeds(t.checkout.halaAr)}
                  </span>
                </span>
              </Button>
            ) : null}
            {stripeEnabled ? (
              <Button
                type="submit"
                name="provider"
                value="card"
                variant={halaEnabled ? "outline" : "default"}
                disabled={pending}
                className="wrap-button h-auto min-h-11 w-full px-5 py-2 sm:w-auto"
                onClick={() => {
                  providerRef.current = "card";
                }}
              >
                {pending ? t.checkout.working : t.checkout.stripe}
              </Button>
            ) : null}
            {moyasarEnabled ? (
              <Button
                type="submit"
                name="provider"
                value="moyasar"
                variant={stripeEnabled || halaEnabled ? "outline" : "default"}
                disabled={pending}
                className="wrap-button h-auto min-h-11 w-full px-5 py-2 sm:w-auto"
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
        ) : null}
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
                <span className="min-w-0">
                  <span dir={textDir(title)}>{title}</span>
                  {product?.kind === "bundle" ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t.checkout.includes(product.includes.length)}
                    </span>
                  ) : null}
                </span>
                <Price price={line.price} compareAt={line.compareAtPrice} previousPrice={line.previousPrice} />
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between gap-3 border-t pt-3 font-medium">
          <span>{t.checkout.total}</span>
          <span className="price text-end">
            <span dir="ltr" className="whitespace-nowrap">{formatMoney(summary.subtotal)}</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">
              {t.price.approx} <span dir="ltr" className="whitespace-nowrap">{formatSarAmount(summary.subtotal)}</span> {t.price.sar}
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
        {buy ? <p className="mt-3 text-xs text-muted-foreground">{t.checkout.buyOnly}</p> : null}
      </aside>
      {open ? (
        <div className="safe-x fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
          <Button
            type="submit"
            form="checkout-form"
            name="provider"
            value={stickyProvider}
            disabled={pending}
            className="wrap-button h-auto min-h-11 w-full px-5 py-2"
          >
            {pending
              ? t.checkout.working
              : halaEnabled
                ? t.checkout.hala
                : stripeEnabled
                  ? t.checkout.stripe
                  : t.checkout.moyasar}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function checkoutNotice(
  t: ReturnType<typeof useI18n>["t"],
  locale: ReturnType<typeof useI18n>["locale"],
  stripeEnabled: boolean,
  moyasarEnabled: boolean,
  halaEnabled: boolean,
) {
  const options = [
    halaEnabled ? t.checkout.optionHala : "",
    stripeEnabled ? t.checkout.optionStripe : "",
    moyasarEnabled ? t.checkout.optionMoyasar : "",
  ].filter(Boolean);
  if (options.length === 1 && stripeEnabled) return t.checkout.noticeStripe;
  if (options.length === 1 && halaEnabled) return t.checkout.noticeHala;
  if (options.length === 1 && moyasarEnabled) return t.checkout.noticeMoyasar;
  return t.checkout.payWith(joinOptions(options, locale));
}

function joinOptions(options: string[], locale: "en" | "ar") {
  if (options.length === 1) return options[0];
  const or = locale === "ar" ? "أو" : "or";
  const comma = locale === "ar" ? "، " : ", ";
  if (options.length === 2) return `${options[0]} ${or} ${options[1]}`;
  return `${options.slice(0, -1).join(comma)}${locale === "ar" ? "، " : ", "}${or} ${options[options.length - 1]}`;
}
