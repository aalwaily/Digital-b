import { POST as checkout } from "@/app/(store)/api/checkout/route";
import { POST as verifyCheckout } from "@/app/(store)/api/checkout/verify/route";
import { faqs } from "@/data/faq";
import { staticSeo } from "@/data/page-seo";
import { site } from "@/data/site";
import { quote } from "@/lib/catalog";
import { parseCheckoutInput } from "@/lib/checkout-input";
import { PAYMENT_UNAVAILABLE_ERROR } from "@/lib/checkout-provider";
import { verifyDownloadToken } from "@/lib/download-token";
import { getDictionary } from "@/lib/i18n/dictionary";
import { arFaqs } from "@/lib/i18n/ar-pages";
import { translateMessage } from "@/lib/i18n/messages";
import { describe, expect, it } from "vitest";

const urgency = /very soon|opens soon|يفتح قريب|قريبًا جدًا|when it opens|حين يفتح الدفع|ليصلك تنبيه/i;

function withEnv(name: string, value: string | undefined, run: () => Promise<void>) {
  const previous = process.env[name];
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
  return run().finally(() => {
    if (previous === undefined) delete process.env[name];
    else process.env[name] = previous;
  });
}

describe("catalog price integrity", () => {
  it("prices from the catalog and ignores a client-sent amount", () => {
    const parsed = parseCheckoutInput({
      email: "reader@example.com",
      slugs: ["steady-mind"],
      price: 0.01,
      amount: 1,
      unit_amount: 1,
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.priced.subtotal).toBe(quote(["steady-mind"]).subtotal);
    expect(parsed.value.priced.subtotal).toBe(9);
    expect(parsed.value.priced.lines[0]?.priceSar).toBe(quote(["steady-mind"]).lines[0]?.priceSar);
  });

  it("rejects a bad body before it would price an order", async () => {
    const invalid = await checkout(
      new Request("https://guides.example.com/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      }),
    );
    expect(invalid.status).toBe(400);

    const email = await checkout(
      new Request("https://guides.example.com/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "not-an-email", slugs: ["steady-mind"], price: 0.01 }),
      }),
    );
    expect(email.status).toBe(400);

    const unknown = await checkout(
      new Request("https://guides.example.com/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "reader@example.com", slugs: ["not-a-guide"], price: 1 }),
      }),
    );
    expect(unknown.status).toBe(400);
  });

  it("does not issue a download when payment is unavailable, even if the client names a price", async () => {
    await withEnv("ENABLE_STRIPE", undefined, async () => {
      await withEnv("ALLOW_DEMO_CHECKOUT", undefined, async () => {
        await withEnv("STRIPE_SECRET_KEY", undefined, async () => {
          const response = await checkout(
            new Request("https://guides.example.com/api/checkout", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                email: "reader@example.com",
                slugs: ["steady-mind", "health-fitness-bundle"],
                price: 0.01,
                amount: 1,
              }),
            }),
          );
          expect(response.status).toBe(503);
          const body = (await response.json()) as { error?: string; token?: string; url?: string };
          expect(body.error).toBe(PAYMENT_UNAVAILABLE_ERROR);
          expect(body.token).toBeUndefined();
          expect(body.url).toBeUndefined();
          expect(translateMessage("ar", body.error || "")).toBe("الدفع عبر الإنترنت غير متاح.");
          expect(translateMessage("en", body.error || "")).toBe(PAYMENT_UNAVAILABLE_ERROR);
        });
      });
    });
  });

  it("signs a demo receipt at the catalog price, not the client price", async () => {
    await withEnv("ENABLE_STRIPE", undefined, async () => {
      await withEnv("ALLOW_DEMO_CHECKOUT", "true", async () => {
        const response = await checkout(
          new Request("https://guides.example.com/api/checkout", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              email: "reader@example.com",
              slugs: ["steady-mind"],
              confirmDemo: true,
              price: 0.01,
            }),
          }),
        );
        expect(response.status).toBe(200);
        const body = (await response.json()) as { token?: string; demo?: boolean };
        expect(body.demo).toBe(true);
        const payload = verifyDownloadToken(body.token || "");
        expect(payload?.items[0]?.price).toBe(9);
        expect(payload?.files).toEqual(["steady-mind"]);
      });
    });
  });

  it("does not confirm a Stripe session while card checkout is off", async () => {
    await withEnv("ENABLE_STRIPE", undefined, async () => {
      await withEnv("STRIPE_SECRET_KEY", undefined, async () => {
        const response = await verifyCheckout(
          new Request("https://guides.example.com/api/checkout/verify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ sessionId: "cs_test_closed" }),
          }),
        );
        expect(response.status).toBe(503);
        const body = (await response.json()) as { token?: string; error?: string };
        expect(body.token).toBeUndefined();
        expect(body.error).toBe(PAYMENT_UNAVAILABLE_ERROR);
      });
    });
  });
});

describe("closed-checkout copy", () => {
  it("states the same request path and final-sale policy in both languages", () => {
    for (const locale of ["en", "ar"] as const) {
      const copy = getDictionary(locale);
      const purchase = [copy.checkout.closed, copy.checkout.final, copy.product.paymentUnavailable, copy.product.salesFinal, copy.cartPage.noteClosed, copy.success.missingTitle].join("\n");
      expect(purchase, locale).not.toMatch(urgency);
      expect(copy.checkout.final.toLowerCase()).toMatch(/final|نهائية/);
      expect(copy.product.salesFinal.toLowerCase()).toMatch(/final|نهائية/);
      expect(copy.checkout.closed).toContain(site.email);
    }
    expect(getDictionary("en").checkout.closed).toMatch(/not available yet/i);
    expect(getDictionary("en").checkout.closed).toMatch(/whatsapp/i);
    expect(getDictionary("ar").checkout.closed).toMatch(/غير متاح/);
    expect(getDictionary("ar").checkout.closed).toMatch(/واتساب/);
    expect(getDictionary("ar").success.missingTitle).toBe("لا توجد دفعة لتأكيدها");
    expect(getDictionary("en").success.confirmingTitle).toMatch(/confirming/i);
  });

  it("does not promise that payment opens soon in customer-facing copy", () => {
    const blobs = [
      JSON.stringify(getDictionary("en")),
      JSON.stringify(getDictionary("ar")),
      JSON.stringify(faqs),
      JSON.stringify(arFaqs),
      JSON.stringify(staticSeo),
      site.description,
    ];
    for (const blob of blobs) expect(blob).not.toMatch(urgency);
  });
});
