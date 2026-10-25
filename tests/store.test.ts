import { describe, expect, it } from "vitest";
import { reviews } from "@/data/reviews";
import { testimonials } from "@/data/testimonials";
import { bundles, getProduct, guides, products } from "@/data/products";
import { expandFiles, overlapWarnings, quote, shopListings } from "@/lib/catalog";
import { cleanSarPrice } from "@/lib/hala";
import { signDownloadToken, verifyDownloadToken } from "@/lib/download-token";
import { preloadArabicFaces, preloadLatinFaces } from "@/lib/font-preload";
import { offerAvailability, productSchema, websiteSchema } from "@/lib/schema";
import { staticSeo } from "@/data/page-seo";
import fs from "node:fs";
import path from "node:path";

describe("catalog", () => {
  it("keeps slugs unique and prices positive", () => {
    const slugs = products.map((product) => product.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const product of products) {
      expect(product.price).toBeGreaterThan(0);
      expect(product.description.length).toBeGreaterThanOrEqual(2);
      expect(product.faqs.length).toBeGreaterThanOrEqual(3);
      expect(product.included.length).toBeGreaterThanOrEqual(4);
      expect(product.contents.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("prices bundles below the sum of their guides", () => {
    for (const bundle of bundles) {
      const sum = bundle.includes.reduce((total, slug) => total + (getProduct(slug)?.price ?? 0), 0);
      expect(bundle.compareAtPrice).toBe(sum);
      expect(bundle.price).toBeLessThan(sum);
      expect(expandFiles([bundle.slug])).toEqual(bundle.includes);
    }
  });

  it("charges half the previous USD price and a nearest-riyal SAR price", () => {
    for (const product of products) {
      expect(product.previousPrice).toBe(product.price * 2);
      expect(product.priceSar).toBe(cleanSarPrice(product.price));
      expect(Number.isInteger(product.priceSar)).toBe(true);
    }
    expect(getProduct("gulf-ats-cv-kit")?.priceSar).toBe(23);
    expect(getProduct("health-fitness-bundle")?.priceSar).toBe(111);
  });

  it("quotes the health bundle with savings and three files", () => {
    const priced = quote(["health-fitness-bundle"]);
    expect(priced.subtotal).toBe(29.5);
    expect(priced.savings).toBe(10.5);
    expect(priced.files).toEqual(["12-week-reset", "weeknight-table", "floor-and-form"]);
  });

  it("warns when a bundle overlaps a guide already in the cart", () => {
    expect(overlapWarnings(["health-fitness-bundle", "floor-and-form"])).toHaveLength(1);
  });
});

describe("download tokens", () => {
  it("round-trips a payload and rejects tampering", () => {
    process.env.DOWNLOAD_SECRET = "test-secret-value-123";
    const token = signDownloadToken({
      orderId: "ord_test",
      email: "reader@example.com",
      items: [{ slug: "steady-mind", title: "Steady Mind", price: 18 }],
      files: ["steady-mind"],
      demo: true,
    });
    const payload = verifyDownloadToken(token);
    expect(payload?.email).toBe("reader@example.com");
    expect(payload?.files).toEqual(["steady-mind"]);

    const [body, sig] = token.split("~");
    expect(verifyDownloadToken(`${body}~${sig.slice(0, -1)}x`)).toBeNull();
  });

  it("rejects expired tokens", () => {
    process.env.DOWNLOAD_SECRET = "test-secret-value-123";
    const token = signDownloadToken({
      orderId: "ord_old",
      email: "reader@example.com",
      items: [{ slug: "habit-ledger", title: "The Habit Ledger", price: 19 }],
      files: ["habit-ledger"],
      demo: false,
      exp: Math.floor(Date.now() / 1000) - 10,
    });
    expect(verifyDownloadToken(token)).toBeNull();
  });
});

describe("schema and sample labels", () => {
  it("does not invent an aggregate rating", () => {
    const guide = guides[0];
    const schema = productSchema(guide, "https://example.com");
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema.offers).toMatchObject({
      priceCurrency: "USD",
      price: guide.price.toFixed(2),
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnLink: "https://example.com/en/legal/refunds",
      },
    });
  });

  it("does not publish fabricated reviews, stars, or testimonials", () => {
    expect(reviews).toEqual([]);
    expect(testimonials).toEqual([]);
    const schema = JSON.stringify(productSchema(guides[0], "https://example.com"));
    expect(schema).not.toMatch(/aggregateRating|reviewCount|ratingValue/);
  });

  it("uses the real price and an availability that matches whether checkout can take payment", () => {
    const saved = {
      PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER,
      ENABLE_STRIPE: process.env.ENABLE_STRIPE,
      ENABLE_MOYASAR: process.env.ENABLE_MOYASAR,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    };
    delete process.env.PAYMENT_PROVIDER;
    delete process.env.ENABLE_STRIPE;
    delete process.env.ENABLE_MOYASAR;
    delete process.env.STRIPE_SECRET_KEY;
    try {
      const guide = guides[0];
      const closed = productSchema(guide, "https://getvellumpress.com");
      expect(offerAvailability(false)).toBe("https://schema.org/OutOfStock");
      expect(closed.offers.availability).toBe("https://schema.org/OutOfStock");
      expect(closed.offers.price).toBe(guide.price.toFixed(2));
      expect(closed.offers.priceCurrency).toBe("USD");
      process.env.PAYMENT_PROVIDER = "hala";
      expect(productSchema(guide, "https://getvellumpress.com").offers.availability).toBe("https://schema.org/InStock");
      const arabic = websiteSchema("https://getvellumpress.com", "ar");
      expect(arabic.description).toBe(staticSeo.arabicHome.description);
      expect(arabic.potentialAction.target).toMatchObject({
        urlTemplate: "https://getvellumpress.com/ar/shop?q={search_term_string}",
      });
      const listing = shopListings("ar").find((item) => item.product.slug === "the-quiet-budget");
      expect(listing?.searchText).toContain("the quiet budget");
      expect(preloadLatinFaces("@font-face{font-family:Outfit;unicode-range:u+00??}")).toBe(true);
      expect(preloadLatinFaces("@font-face{font-family:Outfit Fallback;unicode-range:u+00??}")).toBe(false);
      expect(preloadArabicFaces("@font-face{font-family:Noto Naskh Arabic;font-weight:500;unicode-range:u+06??}")).toBe(true);
      expect(preloadArabicFaces("@font-face{font-family:Noto Naskh Arabic;font-weight:500;unicode-range:u+00??}")).toBe(true);
      expect(preloadArabicFaces("@font-face{font-family:IBM Plex Sans Arabic;font-weight:500;unicode-range:u+06??}")).toBe(false);
      expect(preloadArabicFaces("@font-face{font-family:IBM Plex Sans Arabic;font-weight:500;unicode-range:u+00??}")).toBe(false);
      expect(preloadArabicFaces("@font-face{font-family:IBM Plex Sans Arabic;font-weight:400;unicode-range:u+06??}")).toBe(true);
      expect(preloadArabicFaces("@font-face{font-family:IBM Plex Sans Arabic;font-weight:400;unicode-range:u+00??}")).toBe(true);
      expect(preloadArabicFaces("@font-face{font-family:Noto Naskh Arabic;font-weight:500;unicode-range:u+0001-000c}")).toBe(false);
    } finally {
      for (const [key, value] of Object.entries(saved)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});

describe("pdf files", () => {
  it("ships a full guide and a sample for every product", () => {
    const meta = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "pdf-meta.json"), "utf8")) as Record<
      string,
      { pages: number; samplePages: number }
    >;
    for (const guide of guides) {
      const full = path.join(process.cwd(), "private", "pdfs", `${guide.slug}.pdf`);
      const sample = path.join(process.cwd(), "public", "samples", `${guide.slug}-sample.pdf`);
      expect(fs.readFileSync(full).subarray(0, 5).toString()).toBe("%PDF-");
      expect(fs.readFileSync(sample).subarray(0, 5).toString()).toBe("%PDF-");
      expect(meta[guide.slug].pages).toBeGreaterThanOrEqual(10);
      expect(meta[guide.slug].samplePages).toBeGreaterThanOrEqual(3);
      expect(meta[guide.slug].samplePages).toBeLessThan(meta[guide.slug].pages);
    }
  });
});
