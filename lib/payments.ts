import Stripe from "stripe";

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function demoCheckoutAllowed() {
  if (!isStripeConfigured()) return true;
  return process.env.ALLOW_DEMO_CHECKOUT === "true";
}
