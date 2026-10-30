import { CheckoutView } from "@/components/checkout-view";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireLocale } from "@/lib/i18n/content";
import { tryUsdToSarRate } from "@/lib/moyasar";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import { checkoutOptions } from "@/lib/payments";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  return pageMetadata(publicMetadata(locale, "/checkout")!);
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const options = checkoutOptions();
  const intro = options.open ? (options.hala && !options.stripe && !options.moyasar ? t.checkout.introHala : t.checkout.introMixed) : t.checkout.introClosed;

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 pt-8 pb-8 sm:px-5 sm:pt-12">
      <h1 className="font-serif text-3xl sm:text-4xl">{t.checkout.title}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">{intro}</p>
      <div className="mt-8 min-w-0">
        <Suspense fallback={<p className="text-sm text-muted-foreground">{t.checkout.loading}</p>}>
          <CheckoutView usdToSarRate={tryUsdToSarRate()} />
        </Suspense>
      </div>
    </div>
  );
}
