import { downloadLinkDays } from "@/lib/download-token";
import { createHmac, timingSafeEqual } from "node:crypto";

const CHECKOUT_STATE_TTL_SECONDS = 60 * 60 * 24;
const LIVE_API = "https://api-m.paypal.com";
const SANDBOX_API = "https://api-m.sandbox.paypal.com";

const PAYPAL_CERT_HOSTS = new Set([
  "api.paypal.com",
  "api.sandbox.paypal.com",
  "api-m.paypal.com",
  "api-m.sandbox.paypal.com",
]);

export class PayPalRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PayPalRequestError";
    this.status = status;
  }
}

export type PayPalMoney = {
  currency_code?: string;
  value?: string;
};

export type PayPalCapture = {
  id?: string;
  status?: string;
  amount?: PayPalMoney;
  create_time?: string;
};

export type PayPalPurchaseUnit = {
  custom_id?: string;
  description?: string;
  amount?: PayPalMoney;
  payments?: {
    captures?: PayPalCapture[];
  };
};

export type PayPalOrder = {
  id?: string;
  status?: string;
  purchase_units?: PayPalPurchaseUnit[];
  links?: Array<{ href?: string; rel?: string; method?: string }>;
};

export type PayPalLine = {
  slug: string;
  title: string;
  price: number;
};

export type PayPalOrderRequest = {
  intent: "CAPTURE";
  purchase_units: Array<{
    custom_id: string;
    description: string;
    amount: {
      currency_code: "USD";
      value: string;
      breakdown: {
        item_total: { currency_code: "USD"; value: string };
      };
    };
    items: Array<{
      name: string;
      sku: string;
      quantity: "1";
      category: "DIGITAL_GOODS";
      unit_amount: { currency_code: "USD"; value: string };
    }>;
  }>;
  payment_source: {
    paypal: {
      experience_context: {
        brand_name: string;
        shipping_preference: "NO_SHIPPING";
        user_action: "PAY_NOW";
        return_url: string;
        cancel_url: string;
      };
    };
  };
};

export type PayPalCheck =
  | { ok: true }
  | {
      ok: false;
      reason: "binding" | "status" | "currency" | "amount" | "missing" | "malformed" | "identity";
    };

type CheckoutCheckInput = {
  email: string;
  slugs: string[];
  expectedAmount: number;
  secret: string;
};

export function paypalApiBase() {
  return process.env.PAYPAL_ENV === "live" ? LIVE_API : SANDBOX_API;
}

export function amountToCents(amount: number) {
  if (!Number.isFinite(amount)) throw new Error("Invalid amount");
  const cents = Math.round(amount * 100);
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error("Invalid amount");
  return cents;
}

export function formatUsdCents(cents: number) {
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error("Invalid amount");
  const whole = Math.trunc(cents / 100);
  const fraction = String(cents % 100).padStart(2, "0");
  return `${whole}.${fraction}`;
}

export function parseUsdCents(value: string | undefined) {
  if (!value || !/^(0|[1-9]\d*)\.\d{2}$/.test(value)) return null;
  const [whole, fraction] = value.split(".");
  const cents = Number(whole) * 100 + Number(fraction);
  if (!Number.isSafeInteger(cents)) return null;
  return cents;
}

export function paypalOrderBinding(email: string, slugs: string[], secret: string) {
  const payload = JSON.stringify({ email, slugs });
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function signPayPalCheckoutState(
  input: { email: string; slugs: string[]; now?: number; ttlSeconds?: number },
  secret: string,
) {
  const now = input.now ?? Math.floor(Date.now() / 1000);
  const payload = {
    v: 1 as const,
    email: input.email,
    slugs: input.slugs,
    exp: now + (input.ttlSeconds ?? CHECKOUT_STATE_TTL_SECONDS),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}~${sig}`;
}

export function readPayPalCheckoutState(token: string, secret: string, now = Math.floor(Date.now() / 1000)) {
  if (!token || token.length > 4096) return null;
  const separator = token.lastIndexOf("~");
  if (separator <= 0) return null;
  const body = token.slice(0, separator);
  const sig = token.slice(separator + 1);
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      v?: unknown;
      email?: unknown;
      slugs?: unknown;
      exp?: unknown;
    };
    if (payload.v !== 1) return null;
    if (typeof payload.email !== "string" || !payload.email) return null;
    if (!Array.isArray(payload.slugs) || payload.slugs.length === 0) return null;
    if (!payload.slugs.every((slug) => typeof slug === "string" && slug.length > 0)) return null;
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp < now) return null;
    return { email: payload.email, slugs: payload.slugs };
  } catch {
    return null;
  }
}

type PayPalPurchaseUnitRequest = PayPalOrderRequest["purchase_units"][number];

export type ApplePayOrderRequest = {
  intent: "CAPTURE";
  purchase_units: PayPalOrderRequest["purchase_units"];
};

function buildPurchaseUnit(input: {
  lines: PayPalLine[];
  subtotal: number;
  customId: string;
}): PayPalPurchaseUnitRequest {
  if (input.lines.length === 0) throw new Error("PayPal order has no lines.");
  if (!input.customId) throw new Error("PayPal order is missing its binding.");
  const itemCents = input.lines.map((line) => amountToCents(line.price));
  const itemTotal = itemCents.reduce((sum, cents) => sum + cents, 0);
  const subtotalCents = amountToCents(input.subtotal);
  if (itemTotal !== subtotalCents) {
    throw new Error("Item prices do not add up to the order total.");
  }
  const value = formatUsdCents(subtotalCents);
  const description = input.lines
    .map((line) => line.title)
    .join(", ")
    .slice(0, 127);
  return {
    custom_id: input.customId,
    description,
    amount: {
      currency_code: "USD",
      value,
      breakdown: {
        item_total: { currency_code: "USD", value },
      },
    },
    items: input.lines.map((line, index) => {
      const cents = itemCents[index];
      if (cents === undefined) throw new Error("Missing item price.");
      return {
        name: line.title.slice(0, 127),
        sku: line.slug.slice(0, 127),
        quantity: "1" as const,
        category: "DIGITAL_GOODS" as const,
        unit_amount: { currency_code: "USD" as const, value: formatUsdCents(cents) },
      };
    }),
  };
}

export function buildApplePayOrderBody(input: {
  lines: PayPalLine[];
  subtotal: number;
  customId: string;
}): ApplePayOrderRequest {
  return {
    intent: "CAPTURE",
    purchase_units: [buildPurchaseUnit(input)],
  };
}

export function buildPayPalOrderBody(input: {
  lines: PayPalLine[];
  subtotal: number;
  customId: string;
  returnUrl: string;
  cancelUrl: string;
  brandName: string;
}): PayPalOrderRequest {
  return {
    intent: "CAPTURE",
    purchase_units: [buildPurchaseUnit(input)],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: input.brandName.slice(0, 127),
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: input.returnUrl,
          cancel_url: input.cancelUrl,
        },
      },
    },
  };
}

function expectedCents(amount: number): { ok: true; cents: number } | { ok: false; reason: "amount" } {
  try {
    return { ok: true, cents: amountToCents(amount) };
  } catch {
    return { ok: false, reason: "amount" };
  }
}

function unitAmountMatches(unit: PayPalPurchaseUnit | undefined, expected: number): PayPalCheck {
  if (!unit?.amount) return { ok: false, reason: "malformed" };
  if (unit.amount.currency_code !== "USD") return { ok: false, reason: "currency" };
  const cents = parseUsdCents(unit.amount.value);
  if (cents === null) return { ok: false, reason: "malformed" };
  if (cents !== expected) return { ok: false, reason: "amount" };
  return { ok: true };
}

export function orderMatchesCheckout(order: PayPalOrder, input: CheckoutCheckInput): PayPalCheck {
  if (order.status !== "APPROVED" && order.status !== "COMPLETED") {
    return { ok: false, reason: "status" };
  }
  const units = order.purchase_units ?? [];
  if (units.length !== 1) return { ok: false, reason: "malformed" };
  const binding = paypalOrderBinding(input.email, input.slugs, input.secret);
  if (!units[0]?.custom_id || !safeEqual(units[0].custom_id, binding)) {
    return { ok: false, reason: "binding" };
  }
  const expected = expectedCents(input.expectedAmount);
  if (!expected.ok) return expected;
  return unitAmountMatches(units[0], expected.cents);
}

export function verifyCapturedPayment(order: PayPalOrder, expectedAmount: number): PayPalCheck {
  if (order.status !== "COMPLETED") return { ok: false, reason: "status" };
  const units = order.purchase_units ?? [];
  if (units.length !== 1) return { ok: false, reason: "malformed" };
  const captures = units[0]?.payments?.captures ?? [];
  if (captures.length === 0) return { ok: false, reason: "missing" };
  const expected = expectedCents(expectedAmount);
  if (!expected.ok) return expected;
  let total = 0;
  for (const capture of captures) {
    if (capture.status !== "COMPLETED") return { ok: false, reason: "status" };
    if (capture.amount?.currency_code !== "USD") return { ok: false, reason: "currency" };
    const cents = parseUsdCents(capture.amount?.value);
    if (cents === null) return { ok: false, reason: "malformed" };
    total += cents;
  }
  if (total !== expected.cents) return { ok: false, reason: "amount" };
  return { ok: true };
}

export function assessPayPalOrder(order: PayPalOrder, input: CheckoutCheckInput): PayPalCheck {
  const bound = orderMatchesCheckout(order, input);
  if (!bound.ok) return bound;
  if (order.status !== "COMPLETED") return { ok: false, reason: "status" };
  return verifyCapturedPayment(order, input.expectedAmount);
}

export function isPayPalOrderId(value: string) {
  return /^[0-9A-Z]{10,20}$/.test(value);
}

export function approveUrlFromOrder(order: PayPalOrder) {
  const link = order.links?.find((item) => item.rel === "payer-action" || item.rel === "approve");
  if (!link?.href?.startsWith("https://")) return null;
  return link.href;
}

export function captureCreatedUnix(order: PayPalOrder) {
  const captures = (order.purchase_units ?? []).flatMap((unit) => unit.payments?.captures ?? []);
  const times = captures
    .map((capture) => (capture.create_time ? Date.parse(capture.create_time) : Number.NaN))
    .filter((time) => Number.isFinite(time));
  if (times.length === 0) return null;
  return Math.floor(Math.min(...times) / 1000);
}

export function paypalReceiptTiming(order: PayPalOrder, now = Math.floor(Date.now() / 1000)) {
  const created = captureCreatedUnix(order) ?? now;
  const days = downloadLinkDays();
  return { created, exp: created + days * 86400, days };
}

export function isPayPalCertUrl(value: string | null) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && PAYPAL_CERT_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

type PayPalErrorBody = {
  name?: string;
  details?: Array<{ issue?: string }>;
};

function hasIssue(body: PayPalErrorBody, issue: string) {
  return body.details?.some((detail) => detail.issue === issue) ?? false;
}

async function getAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID?.trim();
  const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  if (!id || !secret) throw new PayPalRequestError("PayPal is not configured.", 501);
  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const response = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!response.ok) throw new PayPalRequestError("PayPal authentication failed.", response.status);
  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new PayPalRequestError("PayPal authentication failed.", 502);
  return data.access_token;
}

async function paypalRequest(path: string, init: RequestInit) {
  const token = await getAccessToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(`${paypalApiBase()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function createPayPalOrder(order: PayPalOrderRequest | ApplePayOrderRequest) {
  const response = await paypalRequest("/v2/checkout/orders", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(order),
  });
  const payload = (await response.json().catch(() => null)) as PayPalOrder | null;
  if (!response.ok || !payload?.id) {
    throw new PayPalRequestError("PayPal order creation failed.", response.status || 502);
  }
  return payload;
}

export async function getPayPalOrder(orderId: string) {
  if (!isPayPalOrderId(orderId)) throw new PayPalRequestError("Invalid PayPal order id.", 400);
  const response = await paypalRequest(`/v2/checkout/orders/${orderId}`, { method: "GET" });
  const payload = (await response.json().catch(() => null)) as PayPalOrder | null;
  if (!response.ok || !payload) {
    throw new PayPalRequestError("PayPal order lookup failed.", response.status || 502);
  }
  return payload;
}

export async function capturePayPalOrder(orderId: string) {
  if (!isPayPalOrderId(orderId)) throw new PayPalRequestError("Invalid PayPal order id.", 400);
  const response = await paypalRequest(`/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Prefer: "return=representation",
      "PayPal-Request-Id": `capture_${orderId}`,
    },
    body: "{}",
  });
  const payload = (await response.json().catch(() => null)) as (PayPalOrder & PayPalErrorBody) | null;
  if (response.ok && payload?.id) return payload;
  if (response.status === 422 && payload && hasIssue(payload, "ORDER_ALREADY_CAPTURED")) {
    return getPayPalOrder(orderId);
  }
  throw new PayPalRequestError("PayPal capture failed.", response.status || 502);
}

export async function verifyPayPalWebhookSignature(headers: Headers, event: unknown) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
  if (!webhookId) throw new PayPalRequestError("PayPal webhook is not configured.", 501);
  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionTime = headers.get("paypal-transmission-time");
  const transmissionSig = headers.get("paypal-transmission-sig");
  const authAlgo = headers.get("paypal-auth-algo");
  const certUrl = headers.get("paypal-cert-url");
  if (!transmissionId || !transmissionTime || !transmissionSig || !authAlgo || !isPayPalCertUrl(certUrl)) {
    return false;
  }
  const token = await getAccessToken();
  const response = await fetch(`${paypalApiBase()}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: event,
    }),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const data = (await response.json()) as { verification_status?: string };
  return data.verification_status === "SUCCESS";
}
