import { CheckoutView } from "@/components/checkout-view";
import { tryUsdToSarRate } from "@/lib/moyasar";
import { isMoyasarEnabled, isPayPalConfigured, isStripeEnabled } from "@/lib/payments";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Pay for Vellum Press PDF guides. Payments are processed by PayPal.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  const paypalEnabled = isPayPalConfigured();
  const stripeEnabled = isStripeEnabled();
  const moyasarEnabled = isMoyasarEnabled();
  const intro = checkoutIntro(stripeEnabled, paypalEnabled, moyasarEnabled);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">{intro}</p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading checkout…</p>}>
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

function checkoutIntro(stripeEnabled: boolean, paypalEnabled: boolean, moyasarEnabled: boolean) {
  if (paypalEnabled && !stripeEnabled && !moyasarEnabled) {
    return "Digital goods only. Payments are processed by PayPal (cards and PayPal balance, Apple Pay where available). You will get a receipt page with the PDFs as soon as PayPal confirms the payment.";
  }
  if (!paypalEnabled && !stripeEnabled && !moyasarEnabled) {
    return "Digital goods only. PayPal is not connected, so checkout is a labeled demo and does not charge you. Confirming the order still opens a receipt with the PDFs.";
  }
  return "Digital goods only. Use one of the payment methods below. You will get a receipt page with the PDFs as soon as the payment is confirmed.";
}
