import { describe, expect, it } from "vitest";
import { reviews } from "@/data/reviews";
import { testimonials } from "@/data/testimonials";
import { bundles, getProduct, guides, products } from "@/data/products";
import { expandFiles, overlapWarnings, quote } from "@/lib/catalog";
import { signDownloadToken, verifyDownloadToken } from "@/lib/download-token";
import { productSchema } from "@/lib/schema";
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

  it("quotes the health bundle with savings and three files", () => {
    const priced = quote(["health-fitness-bundle"]);
    expect(priced.subtotal).toBe(59);
    expect(priced.savings).toBe(21);
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
        merchantReturnLink: "https://example.com/legal/refunds",
      },
    });
  });

  it("does not publish fabricated reviews, stars, or testimonials", () => {
    expect(reviews).toEqual([]);
    expect(testimonials).toEqual([]);
    const schema = JSON.stringify(productSchema(guides[0], "https://example.com"));
    expect(schema).not.toMatch(/aggregateRating|reviewCount|ratingValue/);
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
