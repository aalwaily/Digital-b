import { getProduct } from "@/data/products";
import { quote } from "@/lib/catalog";
import { downloadLinkDays } from "@/lib/download-token";
import { demoCheckoutAllowed, isPayPalConfigured } from "@/lib/payments";
import {
  amountToCents,
  approveUrlFromOrder,
  assessPayPalOrder,
  buildPayPalOrderBody,
  formatUsdCents,
  isPayPalCertUrl,
  orderMatchesCheckout,
  parseUsdCents,
  paypalApiBase,
  paypalOrderBinding,
  paypalReceiptTiming,
  readPayPalCheckoutState,
  signPayPalCheckoutState,
  verifyCapturedPayment,
  type PayPalOrder,
} from "@/lib/paypal";
import { afterEach, describe, expect, it } from "vitest";

const SECRET = "test-secret-value-123";

function withEnv(name: string, value: string | undefined, run: () => void) {
  const previous = process.env[name];
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
  try {
    run();
  } finally {
    if (previous === undefined) delete process.env[name];
    else process.env[name] = previous;
  }
}

function bindingFor(email: string, slugs: string[]) {
  return paypalOrderBinding(email, slugs, SECRET);
}

function order(input: {
  status: string;
  value: string;
  currency?: string;
  customId: string;
  captures?: Array<{ status?: string; value?: string; currency?: string; create_time?: string }>;
  includePayments?: boolean;
}): PayPalOrder {
  const currency = input.currency ?? "USD";
  const includePayments = input.includePayments ?? true;
  return {
    id: "5O190127TN364715T",
    status: input.status,
    purchase_units: [
      {
        custom_id: input.customId,
        amount: { currency_code: currency, value: input.value },
        payments: includePayments
          ? {
              captures: (input.captures ?? [{ status: "COMPLETED", value: input.value, currency }]).map(
                (capture, index) => ({
                  id: `CAP${index}`,
                  status: capture.status,
                  create_time: capture.create_time,
                  amount: { currency_code: capture.currency ?? currency, value: capture.value },
                }),
              ),
            }
          : undefined,
      },
    ],
  };
}

describe("PayPal catalog pricing", () => {
  it("charges a bundle at the bundle price and keeps the included files for delivery", () => {
    const priced = quote(["health-fitness-bundle"]);
    const retail = priced.files.reduce((sum, slug) => sum + (getProduct(slug)?.price ?? 0), 0);
    expect(priced.subtotal).toBe(59);
    expect(priced.savings).toBe(21);
    expect(retail).toBe(80);
    expect(priced.files).toEqual(["12-week-reset", "weeknight-table", "floor-and-form"]);

    const body = buildPayPalOrderBody({
      lines: priced.lines,
      subtotal: priced.subtotal,
      customId: "binding",
      returnUrl: "https://guides.example.com/api/paypal/return?state=abc",
      cancelUrl: "https://guides.example.com/cart?canceled=1",
      brandName: "Vellum Press",
    });
    const unit = body.purchase_units[0];
    expect(unit?.amount.currency_code).toBe("USD");
    expect(unit?.amount.value).toBe("59.00");
    expect(unit?.amount.breakdown.item_total.value).toBe("59.00");
    expect(unit?.items).toEqual([
      {
        name: "Health & Fitness Bundle",
        sku: "health-fitness-bundle",
        quantity: "1",
        category: "DIGITAL_GOODS",
        unit_amount: { currency_code: "USD", value: "59.00" },
      },
    ]);
    expect(unit?.amount.value).not.toBe(formatUsdCents(amountToCents(retail)));
    expect(body.payment_source.paypal.experience_context.shipping_preference).toBe("NO_SHIPPING");
  });

  it("sums a bundle and a guide without expanding the bundle to retail", () => {
    const priced = quote(["health-fitness-bundle", "the-quiet-budget"]);
    expect(priced.subtotal).toBe(81);
    const body = buildPayPalOrderBody({
      lines: priced.lines,
      subtotal: priced.subtotal,
      customId: "binding",
      returnUrl: "https://guides.example.com/return",
      cancelUrl: "https://guides.example.com/cart?canceled=1",
      brandName: "Vellum Press",
    });
    expect(body.purchase_units[0]?.items.map((item) => item.unit_amount.value)).toEqual(["59.00", "22.00"]);
    expect(body.purchase_units[0]?.amount.value).toBe("81.00");
  });

  it("refuses an order body whose subtotal does not match the line prices", () => {
    const priced = quote(["steady-mind"]);
    expect(() =>
      buildPayPalOrderBody({
        lines: priced.lines,
        subtotal: 1,
        customId: "binding",
        returnUrl: "https://guides.example.com/return",
        cancelUrl: "https://guides.example.com/cart?canceled=1",
        brandName: "Vellum Press",
      }),
    ).toThrow(/do not add up/);
  });
});

describe("PayPal amount verification", () => {
  const email = "reader@example.com";
  const slugs = ["health-fitness-bundle"];
  const customId = bindingFor(email, slugs);
  const input = { email, slugs, expectedAmount: 59, secret: SECRET };

  it("accepts a completed capture that matches the catalog total", () => {
    const paid = order({ status: "COMPLETED", value: "59.00", customId });
    expect(verifyCapturedPayment(paid, 59)).toEqual({ ok: true });
    expect(assessPayPalOrder(paid, input)).toEqual({ ok: true });
  });

  it("does not treat an approved order as paid", () => {
    const approved = order({
      status: "APPROVED",
      value: "59.00",
      customId,
      includePayments: false,
    });
    expect(orderMatchesCheckout(approved, input)).toEqual({ ok: true });
    expect(verifyCapturedPayment(approved, 59)).toEqual({ ok: false, reason: "status" });
    expect(assessPayPalOrder(approved, input)).toEqual({ ok: false, reason: "status" });
  });

  it("rejects the retail sum, a short payment, another currency, and a pending capture", () => {
    expect(verifyCapturedPayment(order({ status: "COMPLETED", value: "80.00", customId }), 59)).toEqual({
      ok: false,
      reason: "amount",
    });
    expect(verifyCapturedPayment(order({ status: "COMPLETED", value: "58.99", customId }), 59)).toEqual({
      ok: false,
      reason: "amount",
    });
    expect(
      verifyCapturedPayment(order({ status: "COMPLETED", value: "59.00", currency: "EUR", customId }), 59),
    ).toEqual({ ok: false, reason: "currency" });
    expect(
      verifyCapturedPayment(
        order({
          status: "COMPLETED",
          value: "59.00",
          customId,
          captures: [{ status: "PENDING", value: "59.00" }],
        }),
        59,
      ),
    ).toEqual({ ok: false, reason: "status" });
    expect(verifyCapturedPayment(order({ status: "COMPLETED", value: "59.00", customId, captures: [] }), 59)).toEqual({
      ok: false,
      reason: "missing",
    });
  });

  it("accepts several completed captures only when they sum to the catalog total", () => {
    const split = order({
      status: "COMPLETED",
      value: "59.00",
      customId,
      captures: [
        { status: "COMPLETED", value: "30.00" },
        { status: "COMPLETED", value: "29.00" },
      ],
    });
    expect(verifyCapturedPayment(split, 59)).toEqual({ ok: true });

    const retailSplit = order({
      status: "COMPLETED",
      value: "80.00",
      customId,
      captures: [
        { status: "COMPLETED", value: "40.00" },
        { status: "COMPLETED", value: "40.00" },
      ],
    });
    expect(verifyCapturedPayment(retailSplit, 59)).toEqual({ ok: false, reason: "amount" });
  });

  it("rejects a capture that does not match the purchase-unit amount recorded at checkout", () => {
    const mismatched = order({
      status: "COMPLETED",
      value: "59.00",
      customId,
      captures: [{ status: "COMPLETED", value: "18.00" }],
    });
    expect(orderMatchesCheckout(mismatched, input)).toEqual({ ok: true });
    expect(verifyCapturedPayment(mismatched, 59)).toEqual({ ok: false, reason: "amount" });
    expect(assessPayPalOrder(mismatched, input)).toEqual({ ok: false, reason: "amount" });
  });

  it("rejects a paid order whose binding does not match this cart", () => {
    const otherCart = order({
      status: "COMPLETED",
      value: "59.00",
      customId: bindingFor(email, ["steady-mind"]),
    });
    expect(assessPayPalOrder(otherCart, input)).toEqual({ ok: false, reason: "binding" });
    expect(assessPayPalOrder(otherCart, { ...input, email: "other@example.com" })).toEqual({
      ok: false,
      reason: "binding",
    });
  });

  it("parses PayPal USD strings strictly", () => {
    expect(parseUsdCents("59.00")).toBe(5900);
    expect(parseUsdCents("0.50")).toBe(50);
    expect(parseUsdCents("59")).toBeNull();
    expect(parseUsdCents("59.0")).toBeNull();
    expect(parseUsdCents("59.000")).toBeNull();
    expect(parseUsdCents("01.00")).toBeNull();
    expect(parseUsdCents("59.00 ")).toBeNull();
    expect(formatUsdCents(5900)).toBe("59.00");
    expect(formatUsdCents(1850)).toBe("18.50");
  });
});

describe("PayPal checkout state", () => {
  it("round-trips the cart and rejects tampering or expiry", () => {
    const now = 1_700_000_000;
    const token = signPayPalCheckoutState(
      { email: "reader@example.com", slugs: ["health-fitness-bundle"], now, ttlSeconds: 60 },
      SECRET,
    );
    expect(readPayPalCheckoutState(token, SECRET, now + 30)).toEqual({
      email: "reader@example.com",
      slugs: ["health-fitness-bundle"],
    });
    expect(readPayPalCheckoutState(token, SECRET, now + 61)).toBeNull();
    expect(readPayPalCheckoutState(token, "another-secret-value", now + 30)).toBeNull();
    const [body, sig] = token.split("~");
    expect(readPayPalCheckoutState(`${body}~${sig.slice(0, -1)}x`, SECRET, now + 30)).toBeNull();
  });

  it("keeps the receipt window on the existing download lifetime", () => {
    withEnv("DOWNLOAD_LINK_DAYS", undefined, () => {
      expect(downloadLinkDays()).toBe(14);
      const paid = order({
        status: "COMPLETED",
        value: "59.00",
        customId: "binding",
        captures: [{ status: "COMPLETED", value: "59.00", create_time: "2026-04-01T00:00:00.000Z" }],
      });
      const timing = paypalReceiptTiming(paid, 1_800_000_000);
      expect(timing.days).toBe(14);
      expect(timing.created).toBe(Math.floor(Date.parse("2026-04-01T00:00:00.000Z") / 1000));
      expect(timing.exp).toBe(timing.created + 14 * 86400);
    });
  });
});

describe("PayPal configuration", () => {
  afterEach(() => {
    delete process.env.PAYPAL_ENV;
  });

  it("uses sandbox unless PAYPAL_ENV is exactly live", () => {
    delete process.env.PAYPAL_ENV;
    expect(paypalApiBase()).toBe("https://api-m.sandbox.paypal.com");
    process.env.PAYPAL_ENV = "sandbox";
    expect(paypalApiBase()).toBe("https://api-m.sandbox.paypal.com");
    process.env.PAYPAL_ENV = "LIVE";
    expect(paypalApiBase()).toBe("https://api-m.sandbox.paypal.com");
    process.env.PAYPAL_ENV = "live";
    expect(paypalApiBase()).toBe("https://api-m.paypal.com");
  });

  it("shows PayPal only when both credentials are set and turns demo off", () => {
    withEnv("STRIPE_SECRET_KEY", undefined, () => {
      withEnv("PAYPAL_CLIENT_ID", undefined, () => {
        withEnv("PAYPAL_CLIENT_SECRET", undefined, () => {
          withEnv("ALLOW_DEMO_CHECKOUT", undefined, () => {
            expect(isPayPalConfigured()).toBe(false);
            expect(demoCheckoutAllowed()).toBe(true);
          });
        });
      });
    });

    withEnv("STRIPE_SECRET_KEY", undefined, () => {
      withEnv("PAYPAL_CLIENT_ID", "client-id", () => {
        withEnv("PAYPAL_CLIENT_SECRET", "client-secret", () => {
          withEnv("ALLOW_DEMO_CHECKOUT", undefined, () => {
            expect(isPayPalConfigured()).toBe(true);
            expect(demoCheckoutAllowed()).toBe(false);
          });
          withEnv("ALLOW_DEMO_CHECKOUT", "true", () => {
            expect(demoCheckoutAllowed()).toBe(true);
          });
        });
      });
    });
  });

  it("accepts only PayPal certificate hosts", () => {
    expect(isPayPalCertUrl("https://api.sandbox.paypal.com/v1/notifications/certs/CERT-1")).toBe(true);
    expect(isPayPalCertUrl("https://api.paypal.com/v1/notifications/certs/CERT-1")).toBe(true);
    expect(isPayPalCertUrl("http://api.paypal.com/v1/notifications/certs/CERT-1")).toBe(false);
    expect(isPayPalCertUrl("https://example.com/cert")).toBe(false);
    expect(approveUrlFromOrder({ links: [{ rel: "payer-action", href: "https://www.sandbox.paypal.com/checkoutnow?token=1" }] })).toBe(
      "https://www.sandbox.paypal.com/checkoutnow?token=1",
    );
    expect(approveUrlFromOrder({ links: [{ rel: "approve", href: "http://evil.example/steal" }] })).toBeNull();
  });
});
