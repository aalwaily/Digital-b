import Stripe from "stripe";
import { isMoyasarConfigured } from "@/lib/moyasar";

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
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

export function demoCheckoutAllowed() {
  if (!isStripeConfigured() && !isPayPalConfigured() && !isMoyasarConfigured()) return true;
  return process.env.ALLOW_DEMO_CHECKOUT === "true";
}
