export const PAYMENT_PROVIDERS = ["none", "hala"] as const;
export type PaymentProviderId = (typeof PAYMENT_PROVIDERS)[number];

/**
 * Hosted checkout selector for the Hala placeholder.
 * Only the exact value "hala" selects Hala. Anything else, including a blank
 * value, means no hosted provider is active.
 */
export function paymentProvider(raw: string | undefined | null = process.env.PAYMENT_PROVIDER): PaymentProviderId {
  return raw?.trim().toLowerCase() === "hala" ? "hala" : "none";
}
