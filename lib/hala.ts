import { quote, type Quote } from "@/lib/catalog";
import { signDownloadToken } from "@/lib/download-token";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Hala Payments (هلا للمدفوعات), https://hala.com.
 * Saudi gateway. Charges are in whole SAR.
 *
 * TODO: Hala has not published API docs. This module does not call Hala.
 * The signature header, the hosted-checkout URL, and the webhook body below
 * are placeholders. Replace them when Hala documents the real contract.
 * Nothing here runs unless PAYMENT_PROVIDER=hala.
 */

export const HALA_CURRENCY = "SAR" as const;
export const USD_TO_SAR = 3.75;

/** TODO: Confirm the header name with Hala. Assumed until their docs exist. */
export const HALA_SIGNATURE_HEADER = "x-hala-signature";

export function cleanSarPrice(usd: number) {
  if (!Number.isFinite(usd) || usd <= 0) {
    throw new Error("USD amount must be positive.");
  }
  // Nearest whole riyal. A half riyal rounds away from zero (22.5 → 23).
  const sar = Math.round(usd * USD_TO_SAR);
  if (!Number.isSafeInteger(sar) || sar <= 0) {
    throw new Error("SAR amount must be positive.");
  }
  return sar;
}

export function sarTotal(priced: Quote) {
  return priced.lines.reduce((sum, line) => sum + line.priceSar, 0);
}

export type HalaCheckoutPayload = {
  amount: number;
  currency: typeof HALA_CURRENCY;
  customer: { email: string };
  items: Array<{ sku: string; name: string; amount: number; quantity: 1 }>;
  metadata: { slugs: string };
};

/**
 * Body we would POST to Hala's hosted checkout once they publish an endpoint.
 * TODO: Set the URL from Hala's docs. Do not guess a charge URL.
 */
export function buildHalaCheckoutPayload(input: { email: string; priced: Quote }): HalaCheckoutPayload {
  return {
    amount: sarTotal(input.priced),
    currency: HALA_CURRENCY,
    customer: { email: input.email },
    items: input.priced.lines.map((line) => ({
      sku: line.slug,
      name: line.title,
      amount: line.priceSar,
      quantity: 1,
    })),
    metadata: { slugs: input.priced.lines.map((line) => line.slug).join(",") },
  };
}

export type HalaHostedCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: string };

export function startHalaHostedCheckout(input: { email: string; priced: Quote }): HalaHostedCheckoutResult {
  const payload = buildHalaCheckoutPayload(input);
  if (!Number.isInteger(payload.amount) || payload.amount <= 0) {
    return { ok: false, status: 400, error: "Could not price this order." };
  }
  const apiKey = process.env.HALA_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, status: 501, error: "Hala is not configured." };
  }
  // TODO: POST `payload` to Hala's hosted-checkout endpoint with HALA_API_KEY
  // and return the hosted URL. There is no public API to call yet, so this
  // stays a placeholder and never charges the customer.
  void apiKey;
  void payload;
  return { ok: false, status: 501, error: "Hala hosted checkout is not available yet." };
}

function signaturesMatch(expectedHex: string, provided: string) {
  const normalized = provided.trim().toLowerCase();
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length !== expectedHex.length) return false;
  const left = Buffer.from(normalized, "hex");
  const right = Buffer.from(expectedHex, "hex");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** HMAC-SHA256 hex of the raw body. TODO: Confirm Hala's exact scheme. */
export function signHalaWebhook(rawBody: string, secret: string) {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

export function verifyHalaSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature || !secret) return false;
  return signaturesMatch(signHalaWebhook(rawBody, secret), signature);
}

export type HalaWebhookEvent = {
  id: string;
  status: string;
  currency: string;
  amountSar: number;
  email: string;
  slugs: string[];
};

export function parseHalaWebhook(raw: string): HalaWebhookEvent | null {
  // TODO: Replace this assumed JSON once Hala publishes the webhook schema.
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || record.id.length < 4 || record.id.length > 80) return null;
  if (typeof record.status !== "string" || !record.status) return null;
  if (record.currency !== HALA_CURRENCY) return null;
  if (typeof record.amount !== "number" || !Number.isInteger(record.amount) || record.amount <= 0) return null;
  if (typeof record.email !== "string" || !record.email.includes("@")) return null;
  if (!Array.isArray(record.slugs) || record.slugs.length === 0 || record.slugs.length > 12) return null;
  if (!record.slugs.every((slug) => typeof slug === "string" && slug.length > 0 && slug.length < 80)) return null;
  return {
    id: record.id,
    status: record.status,
    currency: HALA_CURRENCY,
    amountSar: record.amount,
    email: record.email,
    slugs: record.slugs,
  };
}

export type PaidHalaOrder = {
  paid: true;
  id: string;
  email: string;
  priced: Quote;
  amountSar: number;
};

/** Accept the order only after Hala says it is paid for the catalog SAR total. */
export function markHalaOrderPaid(event: HalaWebhookEvent): PaidHalaOrder | { paid: false; reason: string } {
  if (event.status !== "paid") return { paid: false, reason: "status" };
  let priced: Quote;
  try {
    priced = quote(event.slugs);
  } catch {
    return { paid: false, reason: "catalog" };
  }
  const expected = sarTotal(priced);
  if (event.amountSar !== expected) return { paid: false, reason: "amount" };
  return { paid: true, id: event.id, email: event.email, priced, amountSar: expected };
}

/** Issue the download link only for an order that markHalaOrderPaid accepted. */
export function deliverPaidHalaOrder(order: PaidHalaOrder) {
  if (order.paid !== true) {
    throw new Error("Refusing to deliver a download before the order is paid.");
  }
  return signDownloadToken({
    orderId: order.id,
    email: order.email,
    items: order.priced.lines.map((line) => ({ slug: line.slug, title: line.title, price: line.price })),
    files: order.priced.files,
    demo: false,
  });
}
