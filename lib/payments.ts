import Stripe from "stripe";
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

export function isPayPalConfigured() {
  const id = process.env.PAYPAL_CLIENT_ID?.trim();
  const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  return Boolean(id && secret);
}

/** Customer-facing Moyasar checkout. Keys alone stay dormant until this is exactly "true". */
export function isMoyasarEnabled() {
  return process.env.ENABLE_MOYASAR === "true" && isMoyasarConfigured();
}

export function demoCheckoutAllowed() {
  if (!isStripeEnabled() && !isPayPalConfigured() && !isMoyasarEnabled()) return true;
  return process.env.ALLOW_DEMO_CHECKOUT === "true";
}
