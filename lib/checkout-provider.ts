import {
  approveUrlFromOrder,
  buildPayPalOrderBody,
  createPayPalOrder,
  paypalOrderBinding,
  signPayPalCheckoutState,
} from "@/lib/paypal";
import { startHalaHostedCheckout, type HalaHostedCheckoutResult } from "@/lib/hala";
import type { Quote } from "@/lib/catalog";

export const PAYMENT_PROVIDERS = ["paypal", "hala"] as const;
export type PaymentProviderId = (typeof PAYMENT_PROVIDERS)[number];

/** Unset, blank, and any value other than "hala" stay on PayPal. */
export function paymentProvider(raw: string | undefined | null = process.env.PAYMENT_PROVIDER): PaymentProviderId {
  return raw?.trim().toLowerCase() === "hala" ? "hala" : "paypal";
}

export type HostedCheckoutInput = {
  email: string;
  priced: Quote;
  origin: string;
  brandName: string;
  secret: string;
};

export type PayPalHostedCheckoutResult = { ok: true; url: string } | { ok: false; status: number; error: string };

export async function startPayPalHostedCheckout(input: HostedCheckoutInput): Promise<PayPalHostedCheckoutResult> {
  const slugs = input.priced.lines.map((line) => line.slug);
  const state = signPayPalCheckoutState({ email: input.email, slugs }, input.secret);
  const orderBody = buildPayPalOrderBody({
    lines: input.priced.lines,
    subtotal: input.priced.subtotal,
    customId: paypalOrderBinding(input.email, slugs, input.secret),
    returnUrl: `${input.origin}/api/paypal/return?state=${encodeURIComponent(state)}`,
    cancelUrl: `${input.origin}/cart?canceled=1`,
    brandName: input.brandName,
  });
  const order = await createPayPalOrder(orderBody);
  const url = approveUrlFromOrder(order);
  if (!url) return { ok: false, status: 502, error: "PayPal did not return an approval link." };
  return { ok: true, url };
}

export type HostedCheckoutResult =
  | { provider: "paypal"; result: PayPalHostedCheckoutResult }
  | { provider: "hala"; result: HalaHostedCheckoutResult };

/** Dispatch hosted checkout. PayPal is the default. Hala stays a placeholder. */
export async function createHostedCheckout(input: HostedCheckoutInput): Promise<HostedCheckoutResult> {
  if (paymentProvider() === "hala") {
    return { provider: "hala", result: startHalaHostedCheckout(input) };
  }
  return { provider: "paypal", result: await startPayPalHostedCheckout(input) };
}
