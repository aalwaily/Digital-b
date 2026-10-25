import { audience, audienceFor } from "@/data/audience";
import { getProduct, guides, products } from "@/data/products";
import { getDictionary } from "@/lib/i18n/dictionary";
import { approximateKilobytes, fileFacts, pageCountFor, samplePageCount } from "@/lib/catalog";
import { SAMPLE_PREVIEW, samplePreviewSrc } from "@/lib/sample-preview";
import { productSchema } from "@/lib/schema";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const banned = /money-back|money back|refund|استرداد|استرجاع المبلغ|ضمان استرجاع/i;

describe("product page facts", () => {
  it("reads page counts, sample length, and bytes from the shipped PDFs", () => {
    const reset = getProduct("12-week-reset");
    expect(reset).toBeTruthy();
    const facts = fileFacts(reset!);
    expect(facts.pages).toBe(13);
    expect(facts.pages).toBe(pageCountFor(reset!));
    expect(facts.samplePages).toBe(samplePageCount("12-week-reset"));
    expect(facts.files).toBe(1);
    expect(approximateKilobytes(facts.bytes)).toBe(110);

    const bundle = getProduct("health-fitness-bundle");
    expect(bundle && fileFacts(bundle).files).toBe(3);
    expect(bundle && fileFacts(bundle).pages).toBe(13 + 11 + 11);
    expect(bundle && fileFacts(bundle).samplePages).toBe(4 + 3 + 3);
  });

  it("keeps a real sample-page image for every guide", () => {
    for (const guide of guides) {
      const file = path.join(process.cwd(), "public", samplePreviewSrc(guide.slug));
      const bytes = fs.readFileSync(file);
      expect(bytes.subarray(1, 4).toString()).toBe("PNG");
      expect(bytes.readUInt32BE(16)).toBe(SAMPLE_PREVIEW.width);
      expect(bytes.readUInt32BE(20)).toBe(SAMPLE_PREVIEW.height);
      expect(samplePageCount(guide.slug)).toBeGreaterThanOrEqual(SAMPLE_PREVIEW.page);
    }
  });

  it("states who each product is for in both languages without outcome claims", () => {
    expect(Object.keys(audience).sort()).toEqual(products.map((product) => product.slug).sort());
    for (const product of products) {
      for (const locale of ["en", "ar"] as const) {
        const lines = audienceFor(product.slug, locale);
        expect(lines, product.slug).toHaveLength(2);
        for (const line of lines) {
          expect(line.trim().length, `${product.slug} ${locale}`).toBeGreaterThan(20);
          expect(line, `${product.slug} ${locale}`).not.toMatch(banned);
        }
      }
    }
    const copy = getDictionary("ar").product;
    expect(copy.deliveryBody(14)).not.toMatch(banned);
    expect(copy.deliveryClosed).not.toMatch(banned);
    expect(getDictionary("en").product.deliveryBody(14)).toContain("14");
    expect(copy.samplePageCaption(2, 4, 13)).toContain("4");
  });

  it("extends product schema with file facts and still refuses ratings", () => {
    const guide = guides[0];
    const schema = productSchema(guide, "https://getvellumpress.com", "en");
    const facts = fileFacts(guide);
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(JSON.stringify(schema)).not.toMatch(/aggregateRating|reviewCount|ratingValue/);
    expect(schema.offers.price).toBe(guide.price.toFixed(2));
    expect(schema.additionalProperty).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Page count", value: facts.pages }),
        expect.objectContaining({ name: "File format", value: "PDF" }),
        expect.objectContaining({ name: "Page size", value: "US Letter (8.5 x 11 in)" }),
        expect.objectContaining({ name: "File language", value: "English" }),
        expect.objectContaining({ name: "File size", value: facts.bytes, unitText: "bytes" }),
      ]),
    );
    const arabic = productSchema(guide, "https://getvellumpress.com", "ar");
    expect(arabic.additionalProperty).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "لغة الملف", value: "الإنجليزية" })]),
    );
  });
});
