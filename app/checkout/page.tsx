import { CheckoutView } from "@/components/checkout-view";
import { isPayPalConfigured, isStripeConfigured } from "@/lib/payments";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Digital goods only. Pay with a card or PayPal when they are connected. You will get a receipt page with the PDFs as soon as the payment is confirmed.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading checkout…</p>}>
          <CheckoutView stripeEnabled={isStripeConfigured()} paypalEnabled={isPayPalConfigured()} />
        </Suspense>
      </div>
    </div>
  );
}
