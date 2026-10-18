import { quote, type Quote } from "@/lib/catalog";
import { downloadLinkDays } from "@/lib/download-token";
import {
  formatSarHalalas,
  MOYASAR_API_BASE,
  MOYASAR_APPLE_PAY_VALIDATE_URL,
  MOYASAR_CURRENCY,
  MOYASAR_METHODS,
  MOYASAR_NETWORKS,
  usdToHalalas,
  type MoyasarFormConfig,
} from "@/lib/moyasar-amount";
import { createHmac, timingSafeEqual } from "node:crypto";

export {
  formatSarHalalas,
  MOYASAR_APPLE_PAY_VALIDATE_URL,
  MOYASAR_CURRENCY,
  MOYASAR_FORM_CSS,
  MOYASAR_FORM_JS,
  MOYASAR_METHODS,
  MOYASAR_NETWORKS,
  readUsdToSarRate,
  tryUsdToSarRate,
  usdToHalalas,
  type MoyasarFormConfig,
} from "@/lib/moyasar-amount";

export const MOYASAR_CALLBACK_PATH = "/api/moyasar/callback";

const STATE_TTL_SECONDS = 60 * 60 * 24;
const PAYMENT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class MoyasarRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "MoyasarRequestError";
    this.status = status;
  }
}

export type MoyasarKeyMode = "test" | "live";

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function keyMode(value: string, prefix: "pk" | "sk"): MoyasarKeyMode | null {
  const match = new RegExp(`^${prefix}_(test|live)_[A-Za-z0-9]+$`).exec(value);
  if (!match) return null;
  return match[1] === "live" ? "live" : "test";
}

export function moyasarKeys() {
  const publishable = process.env.MOYASAR_PUBLISHABLE_KEY?.trim() ?? "";
  const secret = process.env.MOYASAR_SECRET_KEY?.trim() ?? "";
  const publishableMode = keyMode(publishable, "pk");
  const secretMode = keyMode(secret, "sk");
  return { publishable, secret, publishableMode, secretMode };
}

export function isMoyasarConfigured() {
  const keys = moyasarKeys();
  return Boolean(keys.publishableMode && keys.secretMode && keys.publishableMode === keys.secretMode);
}

export function chargeForQuote(priced: Quote, rateInput?: string) {
  const halalas = usdToHalalas(priced.subtotal, rateInput);
  return { halalas, currency: MOYASAR_CURRENCY, amountLabel: formatSarHalalas(halalas) };
}

export type MoyasarCheckoutState = {
  email: string;
  slugs: string[];
};

export function signMoyasarCheckoutState(
  input: { email: string; slugs: string[]; now?: number; ttlSeconds?: number },
  secret: string,
) {
  const now = input.now ?? Math.floor(Date.now() / 1000);
  const payload = {
    v: 1 as const,
    email: input.email,
    slugs: input.slugs,
    exp: now + (input.ttlSeconds ?? STATE_TTL_SECONDS),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}~${sig}`;
}

export function readMoyasarCheckoutState(token: string, secret: string, now = Math.floor(Date.now() / 1000)) {
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
    if (typeof payload.email !== "string" || !payload.email.includes("@")) return null;
    if (!Array.isArray(payload.slugs) || payload.slugs.length === 0 || payload.slugs.length > 12) return null;
    if (!payload.slugs.every((slug) => typeof slug === "string" && slug.length > 0 && slug.length < 80)) return null;
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp < now) return null;
    return { email: payload.email, slugs: payload.slugs };
  } catch {
    return null;
  }
}

export function moyasarCallbackUrl(origin: string, state: string) {
  const url = new URL(MOYASAR_CALLBACK_PATH, origin);
  url.searchParams.set("state", state);
  return url.toString();
}

export function isMoyasarPaymentId(value: string) {
  return PAYMENT_ID_PATTERN.test(value);
}

export type MoyasarPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  refunded: number;
  callback_url: string;
  created_at?: string;
};

export function parseMoyasarPayment(value: unknown): MoyasarPayment | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || !isMoyasarPaymentId(record.id)) return null;
  if (typeof record.status !== "string" || !record.status) return null;
  if (typeof record.amount !== "number" || !Number.isInteger(record.amount) || record.amount < 0) return null;
  if (typeof record.currency !== "string" || !record.currency) return null;
  const refunded = record.refunded === undefined || record.refunded === null ? 0 : record.refunded;
  if (typeof refunded !== "number" || !Number.isInteger(refunded) || refunded < 0) return null;
  if (record.callback_url != null && typeof record.callback_url !== "string") return null;
  if (record.created_at != null && typeof record.created_at !== "string") return null;
  return {
    id: record.id.toLowerCase(),
    status: record.status,
    amount: record.amount,
    currency: record.currency.toUpperCase(),
    refunded,
    callback_url: typeof record.callback_url === "string" ? record.callback_url : "",
    created_at: typeof record.created_at === "string" ? record.created_at : undefined,
  };
}

export type MoyasarCheck =
  | { ok: true }
  | { ok: false; reason: "status" | "amount" | "currency" | "callback" | "refunded" };

export function callbackCarriesState(callbackUrl: string, state: string, origin: string) {
  if (!callbackUrl || !state) return false;
  let url: URL;
  let expectedOrigin: URL;
  try {
    url = new URL(callbackUrl);
    expectedOrigin = new URL(origin);
  } catch {
    return false;
  }
  if (url.origin !== expectedOrigin.origin) return false;
  if (url.pathname !== MOYASAR_CALLBACK_PATH) return false;
  const found = url.searchParams.get("state");
  if (!found) return false;
  return safeEqual(found, state);
}

export function verifyMoyasarPayment(
  payment: MoyasarPayment,
  expected: { amount: number; currency: string; state: string; origin: string },
): MoyasarCheck {
  if (payment.status !== "paid") return { ok: false, reason: "status" };
  if (payment.refunded !== 0) return { ok: false, reason: "refunded" };
  if (payment.currency !== expected.currency.toUpperCase()) return { ok: false, reason: "currency" };
  if (payment.amount !== expected.amount) return { ok: false, reason: "amount" };
  if (!callbackCarriesState(payment.callback_url, expected.state, expected.origin)) {
    return { ok: false, reason: "callback" };
  }
  return { ok: true };
}

export function moyasarReceiptTiming(createdAt: string | undefined, now = Math.floor(Date.now() / 1000)) {
  const parsed = createdAt ? Date.parse(createdAt) : Number.NaN;
  const created = Number.isFinite(parsed) ? Math.floor(parsed / 1000) : now;
  const days = downloadLinkDays();
  return { created, exp: created + days * 86400, days };
}

export type MoyasarAssessment =
  | {
      ok: true;
      email: string;
      priced: Quote;
      payment: MoyasarPayment;
      halalas: number;
      timing: { created: number; exp: number; days: number };
    }
  | { ok: false; reason: string };

/** Recompute the catalog total and accept the payment only when Moyasar says it is paid for that total. */
export function assessMoyasarPayment(input: {
  paymentId: string;
  stateToken: string;
  secret: string;
  origin: string;
  payment: unknown;
  rate?: string;
  now?: number;
}): MoyasarAssessment {
  const paymentId = input.paymentId.toLowerCase();
  if (!isMoyasarPaymentId(paymentId)) return { ok: false, reason: "id" };
  const state = readMoyasarCheckoutState(input.stateToken, input.secret, input.now);
  if (!state) return { ok: false, reason: "state" };
  let priced: Quote;
  try {
    priced = quote(state.slugs);
  } catch {
    return { ok: false, reason: "catalog" };
  }
  let halalas: number;
  try {
    halalas = usdToHalalas(priced.subtotal, input.rate);
  } catch {
    return { ok: false, reason: "amount" };
  }
  const payment = parseMoyasarPayment(input.payment);
  if (!payment || !safeEqual(payment.id, paymentId)) return { ok: false, reason: "malformed" };
  const check = verifyMoyasarPayment(payment, {
    amount: halalas,
    currency: MOYASAR_CURRENCY,
    state: input.stateToken,
    origin: input.origin,
  });
  if (!check.ok) return check;
  return {
    ok: true,
    email: state.email,
    priced,
    payment,
    halalas,
    timing: moyasarReceiptTiming(payment.created_at, input.now),
  };
}

export function buildMoyasarFormConfig(input: {
  publishableKey: string;
  email: string;
  priced: Quote;
  origin: string;
  state: string;
  brandName: string;
  rate?: string;
}): MoyasarFormConfig {
  const charge = chargeForQuote(input.priced, input.rate);
  return {
    publishableKey: input.publishableKey,
    amount: charge.halalas,
    currency: MOYASAR_CURRENCY,
    amountLabel: charge.amountLabel,
    description: `${input.brandName} digital guides`,
    callbackUrl: moyasarCallbackUrl(input.origin, input.state),
    methods: MOYASAR_METHODS,
    supportedNetworks: MOYASAR_NETWORKS,
    applePay: {
      country: "SA",
      label: input.brandName,
      validateMerchantUrl: MOYASAR_APPLE_PAY_VALIDATE_URL,
    },
    metadata: {
      email: input.email.slice(0, 200),
      slugs: input.priced.lines
        .map((line) => line.slug)
        .join(",")
        .slice(0, 400),
    },
  };
}

export function verifyMoyasarWebhook(
  body: unknown,
  secret: string,
): { ok: true; type: string; paymentId: string | null } | { ok: false; reason: "secret" | "malformed" } {
  if (!secret) return { ok: false, reason: "secret" };
  if (!body || typeof body !== "object") return { ok: false, reason: "malformed" };
  const record = body as Record<string, unknown>;
  if (typeof record.secret_token !== "string" || !safeEqual(record.secret_token, secret)) {
    return { ok: false, reason: "secret" };
  }
  if (typeof record.type !== "string" || !record.type) return { ok: false, reason: "malformed" };
  let paymentId: string | null = null;
  const data = record.data;
  if (data && typeof data === "object" && typeof (data as { id?: unknown }).id === "string") {
    const id = (data as { id: string }).id;
    if (isMoyasarPaymentId(id)) paymentId = id.toLowerCase();
  }
  return { ok: true, type: record.type, paymentId };
}

export async function fetchMoyasarPayment(id: string, secret = process.env.MOYASAR_SECRET_KEY?.trim() ?? "") {
  if (!isMoyasarPaymentId(id)) throw new MoyasarRequestError("Invalid payment id.", 400);
  if (!keyMode(secret, "sk")) throw new MoyasarRequestError("Moyasar secret key is missing.", 501);
  const response = await fetch(`${MOYASAR_API_BASE}/payments/${id}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${secret}:`).toString("base64")}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new MoyasarRequestError("Moyasar payment lookup failed.", response.status === 404 ? 404 : 502);
  }
  return response.json() as Promise<unknown>;
}
