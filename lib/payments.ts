import Stripe from "stripe";
import { paymentProvider } from "@/lib/checkout-provider";
import { isMoyasarConfigured } from "@/lib/moyasar";

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Customer-facing Stripe checkout. Keys alone stay dormant until this is exactly "true". */
export function isStripeEnabled() {
  return process.env.ENABLE_STRIPE === "true" && isStripeConfigured();
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

/** Customer-facing Moyasar checkout. Keys alone stay dormant until this is exactly "true". */
export function isMoyasarEnabled() {
  return process.env.ENABLE_MOYASAR === "true" && isMoyasarConfigured();
}

export function isHalaEnabled() {
  return paymentProvider() === "hala";
}

export type CheckoutOptions = {
  stripe: boolean;
  moyasar: boolean;
  hala: boolean;
  /** At least one customer-facing provider is switched on. */
  open: boolean;
};

export function checkoutOptions(): CheckoutOptions {
  const stripe = isStripeEnabled();
  const moyasar = isMoyasarEnabled();
  const hala = isHalaEnabled();
  return { stripe, moyasar, hala, open: stripe || moyasar || hala };
}

/**
 * Free demo receipts are off unless the owner sets this exactly to "true".
 * A store with no live provider does not hand out paid files.
 */
export function demoCheckoutAllowed() {
  return process.env.ALLOW_DEMO_CHECKOUT === "true";
}
