import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { legalPages } from "@/data/legal";

const source = readFileSync(new URL("../scripts/mobile-audit.mjs", import.meta.url), "utf8");

describe("mobile audit coverage", () => {
  it("visits every product, policy, and key page in the script", () => {
    for (const product of products) {
      expect(source).toContain(`/product/${product.slug}`);
    }
    for (const page of legalPages) {
      expect(source).toContain(`/legal/${page.slug}`);
    }
    for (const path of ["/shop", "/cart", "/checkout", "/contact", "/missing-page"]) {
      expect(source).toContain(`"${path}"`);
    }
  });

  it("includes the phone widths, landscape, and a tablet width", () => {
    for (const width of [320, 360, 375, 390, 412, 430, 768]) {
      expect(source).toContain(`width: ${width},`);
    }
    expect(source).toContain("667x375");
    expect(source).toContain("probePrimaryCta");
    expect(source).toContain("scrollWidth");
  });
});
