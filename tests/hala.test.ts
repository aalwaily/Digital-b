import { POST as halaCheckout } from "@/app/(store)/api/hala/checkout/route";
import { POST as halaWebhook } from "@/app/(store)/api/hala/webhook/route";
import { paymentProvider } from "@/lib/checkout-provider";
import { verifyDownloadToken } from "@/lib/download-token";
import {
  buildHalaCheckoutPayload,
  cleanSarPrice,
  deliverPaidHalaOrder,
  markHalaOrderPaid,
  parseHalaWebhook,
  signHalaWebhook,
  verifyHalaSignature,
  HALA_SIGNATURE_HEADER,
  type PaidHalaOrder,
} from "@/lib/hala";
import { quote } from "@/lib/catalog";
import { afterEach, describe, expect, it, vi } from "vitest";

const SECRET = "hala-webhook-secret";
const DOWNLOAD_SECRET = "test-secret-value-123";

function withEnv(name: string, value: string | undefined, run: () => Promise<void>) {
  const previous = process.env[name];
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
  return run().finally(() => {
    if (previous === undefined) delete process.env[name];
    else process.env[name] = previous;
  });
}

function paidBody(overrides: Record<string, unknown> = {}) {
  const priced = quote(["steady-mind"]);
  return JSON.stringify({
    id: "hala_paid_1",
    status: "paid",
    currency: "SAR",
    amount: priced.lines[0]?.priceSar,
    email: "reader@example.com",
    slugs: ["steady-mind"],
    ...overrides,
  });
}

describe("payment provider", () => {
  it("stays closed unless the flag is exactly hala", () => {
    expect(paymentProvider(undefined)).toBe("none");
    expect(paymentProvider("")).toBe("none");
    expect(paymentProvider("paypal")).toBe("none");
    expect(paymentProvider(" PayPal ")).toBe("none");
    expect(paymentProvider("stripe")).toBe("none");
    expect(paymentProvider("hala")).toBe("hala");
    expect(paymentProvider("HALA")).toBe("hala");
    expect(paymentProvider(" hala ")).toBe("hala");
  });
});

describe("Hala SAR prices", () => {
  it("rounds the new USD price to the nearest riyal at 3.75", () => {
    expect(cleanSarPrice(6)).toBe(23);
    expect(cleanSarPrice(14.5)).toBe(54);
    expect(cleanSarPrice(29.5)).toBe(111);
    const bundle = quote(["health-fitness-bundle"]);
    const parts = quote(["12-week-reset", "weeknight-table", "floor-and-form"]);
    expect(buildHalaCheckoutPayload({ email: "reader@example.com", priced: bundle }).amount).toBe(111);
    expect(buildHalaCheckoutPayload({ email: "reader@example.com", priced: parts }).amount).toBe(54 + 45 + 51);
  });
});

describe("Hala webhook fulfillment", () => {
  it("rejects a bad signature and does not deliver", () => {
    const raw = paidBody();
    expect(verifyHalaSignature(raw, signHalaWebhook(raw, SECRET), SECRET)).toBe(true);
    expect(verifyHalaSignature(raw, signHalaWebhook(raw, "other-secret"), SECRET)).toBe(false);
    expect(verifyHalaSignature(raw, null, SECRET)).toBe(false);
    expect(verifyHalaSignature(`${raw} `, signHalaWebhook(raw, SECRET), SECRET)).toBe(false);
  });

  it("marks the order paid only when the SAR amount matches, then delivers", () => {
    process.env.DOWNLOAD_SECRET = DOWNLOAD_SECRET;
    const paid = parseHalaWebhook(paidBody());
    expect(paid).not.toBeNull();
    const marked = markHalaOrderPaid(paid!);
    expect(marked.paid).toBe(true);
    if (!marked.paid) return;
    const token = deliverPaidHalaOrder(marked);
    const payload = verifyDownloadToken(token);
    expect(payload?.demo).toBe(false);
    expect(payload?.files).toEqual(["steady-mind"]);
    expect(payload?.email).toBe("reader@example.com");

    const pending = parseHalaWebhook(paidBody({ status: "pending" }));
    expect(markHalaOrderPaid(pending!).paid).toBe(false);
    const cheap = parseHalaWebhook(paidBody({ amount: 1 }));
    expect(markHalaOrderPaid(cheap!)).toEqual({ paid: false, reason: "amount" });
  });

  it("refuses to deliver an order that was not marked paid", () => {
    expect(() => deliverPaidHalaOrder({ paid: false } as unknown as PaidHalaOrder)).toThrow(/paid/);
  });
});

describe("Hala routes", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stays closed when the provider flag is unset", async () => {
    await withEnv("PAYMENT_PROVIDER", undefined, async () => {
      const checkout = await halaCheckout(
        new Request("https://guides.example.com/api/hala/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: "reader@example.com", slugs: ["steady-mind"] }),
        }),
      );
      expect(checkout.status).toBe(503);
      const closed = (await checkout.json()) as { error?: string; url?: string; token?: string };
      expect(closed.error).toBe("Online payment is not available.");
      expect(closed.url).toBeUndefined();
      expect(closed.token).toBeUndefined();
      const webhook = await halaWebhook(
        new Request("https://guides.example.com/api/hala/webhook", {
          method: "POST",
          body: paidBody(),
        }),
      );
      expect(webhook.status).toBe(404);
      expect(JSON.stringify(await webhook.json())).not.toContain("downloadUrl");
    });
  });

  it("does not create a Hala charge even when the flag and key are set", async () => {
    await withEnv("PAYMENT_PROVIDER", "hala", async () => {
      await withEnv("HALA_API_KEY", "test-hala-key", async () => {
        const response = await halaCheckout(
          new Request("https://guides.example.com/api/hala/checkout", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              email: "reader@example.com",
              slugs: ["health-fitness-bundle"],
              amount: 1,
            }),
          }),
        );
        expect(response.status).toBe(501);
        const body = (await response.json()) as { url?: string; error?: string };
        expect(body.url).toBeUndefined();
        expect(body.error).toMatch(/not available yet/);
      });
    });
  });

  it("returns a download link only after a valid paid webhook", async () => {
    await withEnv("PAYMENT_PROVIDER", "hala", async () => {
      await withEnv("HALA_WEBHOOK_SECRET", SECRET, async () => {
        await withEnv("DOWNLOAD_SECRET", DOWNLOAD_SECRET, async () => {
          const raw = paidBody();
          const rejected = await halaWebhook(
            new Request("https://guides.example.com/api/hala/webhook", {
              method: "POST",
              headers: { [HALA_SIGNATURE_HEADER]: "00" },
              body: raw,
            }),
          );
          expect(rejected.status).toBe(400);
          expect(JSON.stringify(await rejected.json())).not.toContain("downloadUrl");

          const pendingRaw = paidBody({ status: "pending" });
          const pending = await halaWebhook(
            new Request("https://guides.example.com/api/hala/webhook", {
              method: "POST",
              headers: { [HALA_SIGNATURE_HEADER]: signHalaWebhook(pendingRaw, SECRET) },
              body: pendingRaw,
            }),
          );
          expect(pending.status).toBe(200);
          expect(await pending.json()).toEqual({ received: true, paid: false });

          const accepted = await halaWebhook(
            new Request("https://guides.example.com/api/hala/webhook", {
              method: "POST",
              headers: {
                [HALA_SIGNATURE_HEADER]: signHalaWebhook(raw, SECRET),
                "x-forwarded-host": "guides.example.com",
                "x-forwarded-proto": "https",
              },
              body: raw,
            }),
          );
          expect(accepted.status).toBe(200);
          const body = (await accepted.json()) as { paid?: boolean; downloadUrl?: string };
          expect(body.paid).toBe(true);
          expect(body.downloadUrl).toContain("https://guides.example.com/en/orders/");
          const token = decodeURIComponent(body.downloadUrl?.split("/orders/")[1] ?? "");
          const payload = verifyDownloadToken(token);
          expect(payload?.files).toEqual(["steady-mind"]);
          expect(payload?.demo).toBe(false);
        });
      });
    });
  });
});
