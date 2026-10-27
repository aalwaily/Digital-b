import { orderedPosts, postPath, posts, resolvePostSeo } from "@/data/blog";
import { ENGLISH_PDF_NOTICE, arabicProducts } from "@/data/arabic-catalog";
import { arabicCategorySeo, arabicLegacyPostSeo, arabicProductSeo, categorySeo, legacyPostSeo, productSeo, staticSeo } from "@/data/page-seo";
import { products } from "@/data/products";
import { languageAlternate } from "@/lib/locale-path";
import { postWordCount } from "@/lib/reading";
import { sarAmount } from "@/lib/sar";
import { CANONICAL_ORIGIN, canonicalUrl, readSiteVerification } from "@/lib/seo";
import sitemap from "@/app/sitemap";
import { describe, expect, it } from "vitest";

describe("buyer-intent metadata", () => {
  it("keeps every indexable title under 60 characters and every description under 155", () => {
    const entries = [
      ...Object.entries(staticSeo).map(([key, value]) => ({ key, ...value })),
      ...Object.entries(productSeo).map(([key, value]) => ({ key: `product:${key}`, ...value })),
      ...Object.entries(arabicProductSeo).map(([key, value]) => ({ key: `ar:${key}`, ...value })),
      ...Object.entries(categorySeo).map(([key, value]) => ({ key: `category:${key}`, ...value })),
      ...Object.entries(arabicCategorySeo).map(([key, value]) => ({ key: `ar-category:${key}`, ...value })),
      ...Object.entries(legacyPostSeo).map(([key, value]) => ({ key: `post:${key}`, ...value })),
      ...Object.entries(arabicLegacyPostSeo).map(([key, value]) => ({ key: `ar-post:${key}`, ...value })),
      ...posts.filter((post) => post.longform).map((post) => ({ key: post.slug, ...resolvePostSeo(post) })),
    ];
    const titles = entries.map((entry) => entry.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const entry of entries) {
      expect([...entry.title].length, entry.key).toBeLessThan(60);
      expect([...entry.description].length, entry.key).toBeLessThan(155);
      expect(entry.description.length, entry.key).toBeGreaterThan(40);
    }
  });

  it("points canonicals at getvellumpress.com and lists Arabic URLs in the sitemap", () => {
    expect(canonicalUrl("/")).toBe("https://getvellumpress.com");
    expect(canonicalUrl("/product/gulf-ats-cv-kit")).toBe("https://getvellumpress.com/product/gulf-ats-cv-kit");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.every((url) => url.startsWith(CANONICAL_ORIGIN))).toBe(true);
    expect(urls.some((url) => url.endsWith("/ar"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/ar/blog"))).toBe(true);
    for (const product of products) {
      expect(urls).toContain(canonicalUrl(`/en/product/${product.slug}`));
      expect(urls).toContain(canonicalUrl(`/ar/product/${product.slug}`));
      expect(arabicProducts[product.slug]).toBeTruthy();
      expect(productSeo[product.slug].title).toContain(`$${product.price}`);
      expect(arabicProductSeo[product.slug].description).toContain("الدليل باللغة الإنجليزية");
    }
    for (const post of posts) {
      expect(urls).toContain(canonicalUrl(postPath(post)));
    }
    expect(urls.some((url) => url.includes("/checkout"))).toBe(false);
  });
});

describe("arabic pages and longform articles", () => {
  it("states that the PDF is in English and prices riyals at 3.75", () => {
    expect(ENGLISH_PDF_NOTICE.startsWith("الدليل باللغة الإنجليزية")).toBe(true);
    expect(sarAmount(29)).toBe(108.75);
    expect(sarAmount(12)).toBe(45);
    expect(sarAmount(17)).toBe(63.75);
    expect(languageAlternate("/en/product/the-quiet-budget").href).toBe("/ar/product/the-quiet-budget");
    expect(languageAlternate("/ar").href).toBe("/en");
  });

  it("publishes at least eight long articles, four of them in Arabic, within 900 to 1500 words", () => {
    const longform = posts.filter((post) => post.longform);
    expect(longform.length).toBeGreaterThanOrEqual(8);
    expect(longform.filter((post) => post.lang === "ar").length).toBeGreaterThanOrEqual(4);
    for (const post of longform) {
      const words = postWordCount(post);
      expect(words, post.slug).toBeGreaterThanOrEqual(900);
      expect(words, post.slug).toBeLessThanOrEqual(1500);
      expect(resolvePostSeo(post).title.length).toBeGreaterThan(0);
    }
    const fatLoss = longform.find((post) => post.slug === "fat-loss-meal-plan-pdf");
    expect(postWordCount(fatLoss!) && fatLoss?.blocks.some((block) => block.type === "note" && block.text.includes("not medical advice"))).toBe(true);
    const arabicFatLoss = longform.find((post) => post.slug === "khitat-nuzul-al-wazn");
    const arabicNote = arabicFatLoss?.blocks.find((block) => block.type === "note");
    expect(arabicNote && arabicNote.type === "note" ? arabicNote.text : "").toMatch(/ليست نصيحة طبية|not medical advice/);
    expect(orderedPosts("ar").some((post) => post.slug === "wathiqat-al-amal-al-hur")).toBe(true);
  });
});

describe("search console verification", () => {
  it("accepts well-formed tokens and ignores blanks", () => {
    expect(readSiteVerification({} as NodeJS.ProcessEnv)).toEqual({ google: null, bing: null });
    expect(
      readSiteVerification({
        NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: " abcDEF1234567890 ",
        NEXT_PUBLIC_BING_SITE_VERIFICATION: "1234567890ABCDEF",
      } as NodeJS.ProcessEnv),
    ).toEqual({ google: "abcDEF1234567890", bing: "1234567890ABCDEF" });
    expect(
      readSiteVerification({
        NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: "short",
        NEXT_PUBLIC_BING_SITE_VERIFICATION: "has space",
      } as NodeJS.ProcessEnv),
    ).toEqual({ google: null, bing: null });
  });
});
