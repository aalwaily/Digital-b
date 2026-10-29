import { HALA_HOSTED_CHECKOUT_IMPLEMENTED } from "@/lib/hala";

export const PAYMENT_PROVIDERS = ["none", "hala"] as const;
export type PaymentProviderId = (typeof PAYMENT_PROVIDERS)[number];

/** Customer-facing error when no provider can take a payment. */
export const PAYMENT_UNAVAILABLE_ERROR = "Online payment is not available.";

/**
 * The only hosted-checkout switch for this store.
 * Only the exact value "hala" selects Hala. PayPal, Stripe, Moyasar, a blank
 * value, and anything else mean no hosted provider is active.
 * Stripe and Moyasar keep their own server routes, but this function is what
 * the Hala scaffold and the closed-storefront message consult.
 */
export function paymentProvider(raw: string | undefined | null = process.env.PAYMENT_PROVIDER): PaymentProviderId {
  return raw?.trim().toLowerCase() === "hala" ? "hala" : "none";
}

/**
 * True only when a customer can be sent to Hala and charged.
 * PAYMENT_PROVIDER=hala is not enough: the hosted call is still a placeholder,
 * so the storefront stays on the request-by-email message instead of a button
 * that returns 501.
 */
export function halaCustomerCheckoutReady(
  options: { implemented?: boolean; provider?: string | null; apiKey?: string | null } = {},
) {
  const implemented = options.implemented ?? HALA_HOSTED_CHECKOUT_IMPLEMENTED;
  const provider = options.provider === undefined ? process.env.PAYMENT_PROVIDER : options.provider;
  const apiKey = options.apiKey === undefined ? process.env.HALA_API_KEY : options.apiKey;
  return paymentProvider(provider) === "hala" && implemented && Boolean(apiKey?.trim());
}
