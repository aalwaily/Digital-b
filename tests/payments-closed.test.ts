import { checkoutOptions, demoCheckoutAllowed, isHalaEnabled } from "@/lib/payments";
import { sourcesFor } from "@/data/sources";
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

describe("product sources", () => {
  it("cites only https pages on the guides that make health or Saudi regulatory claims", () => {
    for (const slug of ["12-week-reset", "weeknight-table", "floor-and-form", "steady-mind", "saudi-freelancer-starter-kit"]) {
      const sources = sourcesFor(slug, "en");
      expect(sources.length).toBeGreaterThan(0);
      for (const source of sources) {
        expect(source.href.startsWith("https://")).toBe(true);
        expect(sourcesFor(slug, "ar").some((item) => item.href === source.href)).toBe(true);
      }
    }
    expect(sourcesFor("habit-ledger", "en")).toEqual([]);
    expect(sourcesFor("gulf-ats-cv-kit", "en")).toEqual([]);
  });
});
