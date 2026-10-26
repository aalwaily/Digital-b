import { limitFor } from "@/data/limits";
import { products } from "@/data/products";
import { sourcesFor } from "@/data/sources";
import { checkoutOptions, demoCheckoutAllowed, isHalaEnabled } from "@/lib/payments";
import { describe, expect, it } from "vitest";

describe("closed checkout", () => {
  it("stays closed until Hala, Stripe, or Moyasar is explicitly enabled", () => {
    const saved = {
      PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER,
      ENABLE_STRIPE: process.env.ENABLE_STRIPE,
      ENABLE_MOYASAR: process.env.ENABLE_MOYASAR,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      ALLOW_DEMO_CHECKOUT: process.env.ALLOW_DEMO_CHECKOUT,
    };
    delete process.env.PAYMENT_PROVIDER;
    delete process.env.ENABLE_STRIPE;
    delete process.env.ENABLE_MOYASAR;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.ALLOW_DEMO_CHECKOUT;
    try {
      expect(isHalaEnabled()).toBe(false);
      expect(checkoutOptions()).toEqual({ stripe: false, moyasar: false, hala: false, open: false });
      expect(demoCheckoutAllowed()).toBe(false);
      process.env.PAYMENT_PROVIDER = "hala";
      expect(checkoutOptions().hala).toBe(true);
      expect(checkoutOptions().open).toBe(true);
    } finally {
      for (const [key, value] of Object.entries(saved)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});

describe("product sources and limits", () => {
  it("gives every product a bilingual limit and https sources where a claim was checked", () => {
    for (const product of products) {
      expect(limitFor(product.slug, "en").length, product.slug).toBeGreaterThan(40);
      expect(limitFor(product.slug, "ar").length, product.slug).toBeGreaterThan(40);
      const sources = sourcesFor(product.slug, "en");
      const arabic = sourcesFor(product.slug, "ar");
      expect(arabic.map((item) => item.href)).toEqual(sources.map((item) => item.href));
      for (const source of sources) {
        expect(source.href.startsWith("https://"), source.href).toBe(true);
        expect(source.label.length).toBeGreaterThan(3);
        expect(source.note.length).toBeGreaterThan(20);
      }
    }
    expect(sourcesFor("first-client", "en")).toEqual([]);
    expect(sourcesFor("saudi-freelancer-starter-kit", "en").some((item) => item.href.includes("hrsd.gov.sa"))).toBe(true);
    expect(sourcesFor("weeknight-table", "en").some((item) => item.href.includes("fsis.usda.gov"))).toBe(true);
    expect(sourcesFor("gulf-ats-cv-kit", "en").some((item) => item.href.includes("hrsd.gov.sa"))).toBe(true);
    expect(sourcesFor("gulf-work-bundle", "en").length).toBeGreaterThan(sourcesFor("gulf-ats-cv-kit", "en").length);
  });
});
