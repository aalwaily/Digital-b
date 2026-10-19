import { CheckoutView } from "@/components/checkout-view";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireLocale } from "@/lib/i18n/content";
import { tryUsdToSarRate } from "@/lib/moyasar";
import { isMoyasarEnabled, isPayPalConfigured, isStripeEnabled } from "@/lib/payments";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  return {
    title: t.checkout.title,
    description: t.checkout.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const paypalEnabled = isPayPalConfigured();
  const stripeEnabled = isStripeEnabled();
  const moyasarEnabled = isMoyasarEnabled();
  const intro =
    paypalEnabled && !stripeEnabled && !moyasarEnabled
      ? t.checkout.introPaypal
      : !paypalEnabled && !stripeEnabled && !moyasarEnabled
        ? t.checkout.introDemo
        : t.checkout.introMixed;

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-5 pt-12 pb-8">
      <h1 className="font-serif text-4xl">{t.checkout.title}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">{intro}</p>
      <div className="mt-8 min-w-0">
        <Suspense fallback={<p className="text-sm text-muted-foreground">{t.checkout.loading}</p>}>
          <CheckoutView
            stripeEnabled={stripeEnabled}
            paypalEnabled={paypalEnabled}
            moyasarEnabled={moyasarEnabled}
            usdToSarRate={tryUsdToSarRate()}
          />
        </Suspense>
      </div>
    </div>
  );
}
