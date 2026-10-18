import { quote } from "@/lib/catalog";
import { demoCheckoutAllowed, isMoyasarEnabled } from "@/lib/payments";
import { verifyDownloadToken } from "@/lib/download-token";
import { MoyasarAmountError, usdToHalalas, readUsdToSarRate, formatSarHalalas } from "@/lib/moyasar-amount";
import {
  assessMoyasarPayment,
  buildMoyasarFormConfig,
  isMoyasarConfigured,
  moyasarCallbackUrl,
  signMoyasarCheckoutState,
  verifyMoyasarPayment,
  verifyMoyasarWebhook,
  type MoyasarPayment,
} from "@/lib/moyasar";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SECRET = "test-secret-value-123";
const ORIGIN = "https://guides.example.com";
const PAYMENT_ID = "79cced57-9deb-4c4b-8f48-59c124f79688";
const ENV_KEYS = [
  "MOYASAR_PUBLISHABLE_KEY",
  "MOYASAR_SECRET_KEY",
  "MOYASAR_WEBHOOK_SECRET",
  "USD_TO_SAR_RATE",
  "DOWNLOAD_SECRET",
  "MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION",
  "ALLOW_DEMO_CHECKOUT",
  "ENABLE_MOYASAR",
] as const;

const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) saved[key] = process.env[key];
  delete process.env.USD_TO_SAR_RATE;
  process.env.DOWNLOAD_SECRET = SECRET;
  process.env.MOYASAR_PUBLISHABLE_KEY = "pk_test_publishablekey";
  process.env.MOYASAR_SECRET_KEY = "sk_test_secretkey";
  process.env.ENABLE_MOYASAR = "true";
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.unstubAllGlobals();
});

function paidPayment(overrides: Partial<MoyasarPayment> & { callback_url?: string } = {}): MoyasarPayment {
  const state = overrides.callback_url
    ? ""
    : signMoyasarCheckoutState({ email: "reader@example.com", slugs: ["steady-mind"] }, SECRET);
  return {
    id: PAYMENT_ID,
    status: "paid",
    amount: usdToHalalas(18),
    currency: "SAR",
    refunded: 0,
    callback_url: overrides.callback_url ?? moyasarCallbackUrl(ORIGIN, state),
    created_at: "2026-10-18T08:00:00.000Z",
    ...overrides,
  };
}

describe("USD to SAR conversion", () => {
  it("uses the 3.75 peg when the rate is unset and converts catalog dollars to halalas", () => {
    expect(readUsdToSarRate(undefined)).toBe("3.75");
    expect(readUsdToSarRate("")).toBe("3.75");
    expect(usdToHalalas(18)).toBe(6750);
    expect(formatSarHalalas(6750)).toBe("SAR 67.50");
    expect(usdToHalalas(29, "3.75")).toBe(10875);
  });

  it("prices a bundle from its catalog price, not the sum of the guides", () => {
    const bundle = quote(["health-fitness-bundle"]);
    const parts = quote(["12-week-reset", "weeknight-table", "floor-and-form"]);
    expect(bundle.subtotal).toBe(59);
    expect(parts.subtotal).toBe(80);
    expect(usdToHalalas(bundle.subtotal)).toBe(22125);
    expect(usdToHalalas(parts.subtotal)).toBe(30000);
    expect(formatSarHalalas(22125)).toBe("SAR 221.25");
  });

  it("rounds half a halala up and honors an explicit rate", () => {
    expect(usdToHalalas(10.01, "3.75")).toBe(3754);
    expect(usdToHalalas(18, "3.750000")).toBe(6750);
    expect(usdToHalalas(10, "4")).toBe(4000);
  });

  it("rejects a non-positive amount or a bad rate", () => {
    expect(() => usdToHalalas(0)).toThrow(MoyasarAmountError);
    expect(() => usdToHalalas(-5)).toThrow(MoyasarAmountError);
    expect(() => readUsdToSarRate("0")).toThrow(MoyasarAmountError);
    expect(() => readUsdToSarRate("nope")).toThrow(MoyasarAmountError);
    expect(() => readUsdToSarRate("-3.75")).toThrow(MoyasarAmountError);
    expect(() => usdToHalalas(0.01, "3.75")).toThrow(MoyasarAmountError);
  });
});

describe("Moyasar payment verification", () => {
  it("accepts a paid SAR payment that matches the signed cart", () => {
    const state = signMoyasarCheckoutState({ email: "reader@example.com", slugs: ["steady-mind"] }, SECRET);
    const payment = paidPayment({ callback_url: moyasarCallbackUrl(ORIGIN, state) });
    expect(
      verifyMoyasarPayment(payment, { amount: 6750, currency: "SAR", state, origin: ORIGIN }),
    ).toEqual({ ok: true });
    const assessed = assessMoyasarPayment({
      paymentId: PAYMENT_ID,
      stateToken: state,
      secret: SECRET,
      origin: ORIGIN,
      payment,
      now: 1_700_000_000,
    });
    expect(assessed.ok).toBe(true);
    if (assessed.ok) {
      expect(assessed.halalas).toBe(6750);
      expect(assessed.priced.files).toEqual(["steady-mind"]);
      expect(assessed.email).toBe("reader@example.com");
    }
  });

  it("refuses a client-supplied cheaper amount, a wrong currency, and an unpaid status", () => {
    const state = signMoyasarCheckoutState(
      { email: "reader@example.com", slugs: ["health-fitness-bundle"] },
      SECRET,
    );
    const callback_url = moyasarCallbackUrl(ORIGIN, state);
    const base = {
      paymentId: PAYMENT_ID,
      stateToken: state,
      secret: SECRET,
      origin: ORIGIN,
      now: 1_700_000_000,
    };
    expect(
      assessMoyasarPayment({
        ...base,
        payment: { ...paidPayment({ callback_url, amount: 100 }), amount: 100 },
      }).ok,
    ).toBe(false);
    expect(
      assessMoyasarPayment({
        ...base,
        payment: paidPayment({ callback_url, currency: "USD", amount: 22125 }),
      }),
    ).toMatchObject({ ok: false, reason: "currency" });
    expect(
      assessMoyasarPayment({
        ...base,
        payment: paidPayment({ callback_url, status: "failed", amount: 22125 }),
      }),
    ).toMatchObject({ ok: false, reason: "status" });
    expect(
      assessMoyasarPayment({
        ...base,
        payment: paidPayment({ callback_url, status: "authorized", amount: 22125 }),
      }),
    ).toMatchObject({ ok: false, reason: "status" });
    expect(
      assessMoyasarPayment({
        ...base,
        payment: paidPayment({ callback_url, refunded: 22125, amount: 22125 }),
      }),
    ).toMatchObject({ ok: false, reason: "refunded" });
  });

  it("refuses a payment whose callback is not this checkout state", () => {
    const state = signMoyasarCheckoutState({ email: "reader@example.com", slugs: ["steady-mind"] }, SECRET);
    const other = signMoyasarCheckoutState({ email: "other@example.com", slugs: ["steady-mind"] }, SECRET);
    const assessed = assessMoyasarPayment({
      paymentId: PAYMENT_ID,
      stateToken: state,
      secret: SECRET,
      origin: ORIGIN,
      payment: paidPayment({ callback_url: moyasarCallbackUrl(ORIGIN, other) }),
    });
    expect(assessed).toMatchObject({ ok: false, reason: "callback" });
    expect(
      assessMoyasarPayment({
        paymentId: PAYMENT_ID,
        stateToken: state,
        secret: SECRET,
        origin: ORIGIN,
        payment: paidPayment({ callback_url: moyasarCallbackUrl("https://evil.example", state) }),
      }),
    ).toMatchObject({ ok: false, reason: "callback" });
    expect(
      assessMoyasarPayment({
        paymentId: PAYMENT_ID,
        stateToken: `${state}x`,
        secret: SECRET,
        origin: ORIGIN,
        payment: paidPayment(),
      }),
    ).toMatchObject({ ok: false, reason: "state" });
  });

  it("builds the form from the catalog total and enables mada, cards, Apple Pay, and STC Pay", () => {
    const priced = quote(["health-fitness-bundle"]);
    const state = signMoyasarCheckoutState({ email: "reader@example.com", slugs: ["health-fitness-bundle"] }, SECRET);
    const config = buildMoyasarFormConfig({
      publishableKey: "pk_test_publishablekey",
      email: "reader@example.com",
      priced,
      origin: ORIGIN,
      state,
      brandName: "Vellum Press",
    });
    expect(config.amount).toBe(22125);
    expect(config.currency).toBe("SAR");
    expect(config.amountLabel).toBe("SAR 221.25");
    expect(config.methods).toEqual(["creditcard", "applepay", "stcpay"]);
    expect(config.supportedNetworks).toEqual(["mada", "visa", "mastercard"]);
    expect(config.applePay.validateMerchantUrl).toBe("https://api.moyasar.com/v1/applepay/initiate");
    expect(config.callbackUrl).toContain("/api/moyasar/callback");
    expect(config).not.toHaveProperty("secret");
  });
});

describe("Moyasar webhook secret", () => {
  it("accepts the shared secret and rejects a mismatch", () => {
    const body = {
      type: "payment_paid",
      secret_token: "hook-secret",
      data: { id: PAYMENT_ID },
    };
    expect(verifyMoyasarWebhook(body, "hook-secret")).toEqual({
      ok: true,
      type: "payment_paid",
      paymentId: PAYMENT_ID,
    });
    expect(verifyMoyasarWebhook({ ...body, secret_token: "hook-secreT" }, "hook-secret")).toEqual({
      ok: false,
      reason: "secret",
    });
    expect(verifyMoyasarWebhook({ ...body, secret_token: "short" }, "hook-secret")).toEqual({
      ok: false,
      reason: "secret",
    });
    expect(verifyMoyasarWebhook({ type: "payment_paid" }, "hook-secret")).toEqual({
      ok: false,
      reason: "secret",
    });
  });
});

describe("Moyasar routes", () => {
  it("prepares a session from the catalog and ignores a client amount", async () => {
    const { POST } = await import("@/app/api/moyasar/session/route");
    const response = await POST(
      new Request("https://guides.example.com/api/moyasar/session", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-host": "guides.example.com", "x-forwarded-proto": "https" },
        body: JSON.stringify({
          slugs: ["steady-mind"],
          email: "reader@example.com",
          amount: 100,
          currency: "USD",
        }),
      }),
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { amount: number; currency: string; publishableKey: string };
    expect(body.amount).toBe(6750);
    expect(body.currency).toBe("SAR");
    expect(body.publishableKey.startsWith("pk_test_")).toBe(true);
    expect(JSON.stringify(body)).not.toContain("sk_test_");
  });

  it("issues a receipt only after Moyasar reports the paid catalog total", async () => {
    const state = signMoyasarCheckoutState({ email: "reader@example.com", slugs: ["steady-mind"] }, SECRET);
    const payment = paidPayment({ callback_url: moyasarCallbackUrl(ORIGIN, state) });
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe(`https://api.moyasar.com/v1/payments/${PAYMENT_ID}`);
      const authorization = new Headers(init?.headers).get("authorization") ?? "";
      expect(Buffer.from(authorization.replace("Basic ", ""), "base64").toString()).toBe("sk_test_secretkey:");
      return new Response(JSON.stringify(payment), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const { GET } = await import("@/app/api/moyasar/callback/route");
    const response = await GET(
      new Request(
        `https://guides.example.com/api/moyasar/callback?id=${PAYMENT_ID}&state=${encodeURIComponent(state)}&status=paid`,
        { headers: { "x-forwarded-host": "guides.example.com", "x-forwarded-proto": "https" } },
      ),
    );
    expect(response.status).toBe(303);
    const location = response.headers.get("location") ?? "";
    expect(location).toContain("/orders/");
    const token = decodeURIComponent(new URL(location).pathname.split("/").pop() ?? "");
    const payload = verifyDownloadToken(token);
    expect(payload?.files).toEqual(["steady-mind"]);
    expect(payload?.demo).toBe(false);
    expect(payload?.orderId).toBe(PAYMENT_ID);
  });

  it("does not issue a receipt when the fetched payment is not paid", async () => {
    const state = signMoyasarCheckoutState({ email: "reader@example.com", slugs: ["steady-mind"] }, SECRET);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(paidPayment({ callback_url: moyasarCallbackUrl(ORIGIN, state), status: "failed" })), { status: 200 })),
    );
    const { GET } = await import("@/app/api/moyasar/callback/route");
    const response = await GET(
      new Request(`https://guides.example.com/api/moyasar/callback?id=${PAYMENT_ID}&state=${encodeURIComponent(state)}&status=paid`, {
        headers: { "x-forwarded-host": "guides.example.com", "x-forwarded-proto": "https" },
      }),
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/checkout?moyasar=failed");
  });

  it("verifies the webhook secret and does not treat it as fulfillment", async () => {
    process.env.MOYASAR_WEBHOOK_SECRET = "hook-secret";
    const { POST } = await import("@/app/api/moyasar/webhook/route");
    const rejected = await POST(
      new Request("https://guides.example.com/api/moyasar/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "payment_paid", secret_token: "nope", data: { id: PAYMENT_ID } }),
      }),
    );
    expect(rejected.status).toBe(400);

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ id: PAYMENT_ID, status: "paid", amount: 6750, currency: "SAR" }), { status: 200 })),
    );
    const accepted = await POST(
      new Request("https://guides.example.com/api/moyasar/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "payment_paid", secret_token: "hook-secret", data: { id: PAYMENT_ID } }),
      }),
    );
    expect(accepted.status).toBe(200);
    expect(await accepted.json()).toEqual({ received: true });
  });

  it("hides Moyasar unless the flag is on and the keys are a matching pair", () => {
    expect(isMoyasarConfigured()).toBe(true);
    expect(isMoyasarEnabled()).toBe(true);
    const stripe = process.env.STRIPE_SECRET_KEY;
    const paypalId = process.env.PAYPAL_CLIENT_ID;
    const paypalSecret = process.env.PAYPAL_CLIENT_SECRET;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.PAYPAL_CLIENT_ID;
    delete process.env.PAYPAL_CLIENT_SECRET;
    delete process.env.ALLOW_DEMO_CHECKOUT;
    expect(demoCheckoutAllowed()).toBe(false);
    delete process.env.ENABLE_MOYASAR;
    expect(isMoyasarEnabled()).toBe(false);
    expect(demoCheckoutAllowed()).toBe(true);
    process.env.ENABLE_MOYASAR = "true";
    process.env.MOYASAR_SECRET_KEY = "sk_live_secretkey";
    expect(isMoyasarConfigured()).toBe(false);
    expect(isMoyasarEnabled()).toBe(false);
    expect(demoCheckoutAllowed()).toBe(true);
    process.env.MOYASAR_PUBLISHABLE_KEY = "";
    process.env.MOYASAR_SECRET_KEY = "";
    expect(isMoyasarConfigured()).toBe(false);
    expect(isMoyasarEnabled()).toBe(false);
    if (stripe === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = stripe;
    if (paypalId === undefined) delete process.env.PAYPAL_CLIENT_ID;
    else process.env.PAYPAL_CLIENT_ID = paypalId;
    if (paypalSecret === undefined) delete process.env.PAYPAL_CLIENT_SECRET;
    else process.env.PAYPAL_CLIENT_SECRET = paypalSecret;
  });
});
