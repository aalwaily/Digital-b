import { posts } from "@/data/blog";
import { faqs } from "@/data/faq";
import { legalPages } from "@/data/legal";
import { categories, products } from "@/data/products";
import sitemap from "@/app/sitemap";
import { arCategories, arProducts } from "@/lib/i18n/ar-catalog";
import { arFaqs, arLegal, arPosts } from "@/lib/i18n/ar-pages";
import { isolateEmbeds, stripBidiIsolates } from "@/lib/i18n/bidi";
import { negotiateLocale, localeFromAcceptLanguage, localePath } from "@/lib/i18n/config";
import { localizeProduct } from "@/lib/i18n/content";
import { dictionary, getDictionary } from "@/lib/i18n/dictionary";
import { approximateSar, USD_TO_SAR_PEG } from "@/lib/money";
import { pageMetadata } from "@/lib/page-meta";
import { productSchema } from "@/lib/schema";
import { describe, expect, it } from "vitest";

describe("locale negotiation", () => {
  it("sends Arabic browsers to Arabic and everyone else to English", () => {
    expect(localeFromAcceptLanguage("ar-SA,ar;q=0.9,en;q=0.5")).toBe("ar");
    expect(localeFromAcceptLanguage("en-US,en;q=0.8")).toBe("en");
    expect(localeFromAcceptLanguage("fr-FR,fr;q=0.9")).toBe("en");
    expect(localeFromAcceptLanguage(null)).toBe("en");
  });

  it("redirects the first visit and keeps a manual choice", () => {
    expect(
      negotiateLocale({ pathname: "/", cookie: null, acceptLanguage: "ar", userAgent: "Mozilla/5.0" }),
    ).toEqual({ action: "redirect", locale: "ar", pathname: "/ar", status: 307 });
    expect(
      negotiateLocale({ pathname: "/shop", cookie: null, acceptLanguage: "en-GB", userAgent: "Mozilla/5.0" }),
    ).toEqual({ action: "redirect", locale: "en", pathname: "/en/shop", status: 301 });
    expect(
      negotiateLocale({ pathname: "/shop", cookie: "ar", acceptLanguage: "en", userAgent: "Mozilla/5.0" }),
    ).toEqual({ action: "redirect", locale: "ar", pathname: "/ar/shop", status: 301 });
  });

  it("does not redirect a URL that already has a locale", () => {
    expect(
      negotiateLocale({ pathname: "/ar/shop", cookie: "en", acceptLanguage: "en", userAgent: "Mozilla/5.0" }),
    ).toEqual({ action: "next", locale: "ar" });
  });

  it("serves the requested URL to crawlers without a redirect", () => {
    expect(
      negotiateLocale({
        pathname: "/product/steady-mind",
        cookie: "ar",
        acceptLanguage: "ar",
        userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      }),
    ).toEqual({ action: "rewrite", locale: "en", pathname: "/en/product/steady-mind" });
    expect(
      negotiateLocale({ pathname: "/ar", cookie: null, acceptLanguage: "en", userAgent: "Googlebot" }),
    ).toEqual({ action: "next", locale: "ar" });
  });
});

describe("bilingual catalog", () => {
  it("keeps the Arabic dictionary the same shape as English", () => {
    const mismatches: string[] = [];
    walk(dictionary.en, dictionary.ar, "", mismatches);
    expect(mismatches).toEqual([]);
  });

  it("translates every product, category, FAQ, legal page, and journal post", () => {
    for (const category of categories) {
      expect(arCategories[category.slug]?.name).toBeTruthy();
    }
    expect(arFaqs).toHaveLength(faqs.length);
    for (const page of legalPages) {
      const copy = arLegal[page.slug];
      expect(copy?.title).toBeTruthy();
      expect(copy.sections).toHaveLength(page.sections.length);
      copy.sections.forEach((section, index) => {
        expect(section.paragraphs).toHaveLength(page.sections[index].paragraphs.length);
      });
    }
    for (const post of posts) {
      const copy = arPosts[post.slug];
      expect(copy?.title).toBeTruthy();
      expect(copy.blocks.map((block) => block.type)).toEqual(post.blocks.map((block) => block.type));
    }
    for (const product of products) {
      const copy = arProducts[product.slug];
      expect(copy, product.slug).toBeTruthy();
      expect(copy.description).toHaveLength(product.description.length);
      expect(copy.included).toHaveLength(product.included.length);
      expect(copy.contents).toHaveLength(product.contents.length);
      expect(copy.faqs).toHaveLength(product.faqs.length);
      expect(copy.cover.titleLines.length).toBeGreaterThan(0);
    }
  });

  it("prices USD with an approximate SAR amount at the 3.75 peg", () => {
    expect(USD_TO_SAR_PEG).toBe(3.75);
    expect(approximateSar(29)).toBe(108.75);
    expect(approximateSar(12)).toBe(45);
  });
});

describe("localized SEO", () => {
  it("publishes hreflang alternates and a locale canonical", () => {
    const meta = pageMetadata({
      title: "Shop",
      description: "Guides",
      path: "/shop",
      locale: "ar",
    });
    expect(meta.alternates?.canonical).toBe("/ar/shop");
    expect(meta.alternates?.languages).toMatchObject({
      en: "/en/shop",
      ar: "/ar/shop",
      "x-default": "/en/shop",
    });
  });

  it("lists both locales in the sitemap and points Arabic product schema at /ar", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith("/en/product/steady-mind"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/ar/product/steady-mind"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/checkout"))).toBe(false);
    const sample = entries.find((entry) => entry.url.endsWith("/en/shop"));
    expect(sample?.alternates?.languages).toMatchObject({
      en: expect.stringMatching(/\/en\/shop$/),
      ar: expect.stringMatching(/\/ar\/shop$/),
      "x-default": expect.stringMatching(/\/en\/shop$/),
    });
    const schema = productSchema(products[0], "https://example.com", "ar");
    expect(schema.url).toBe(`https://example.com/ar/product/${products[0].slug}`);
    expect(schema.name).toBe(arProducts[products[0].slug].title);
    expect(schema.inLanguage).toBe("ar");
  });

  it("isolates Latin brands, prices, titles, emails, and URLs inside Arabic", () => {
    const lede = getDictionary("ar").home.lede;
    expect(lede).toContain("\u2066Vellum Press\u2069");
    expect(getDictionary("en").home.lede).not.toContain("\u2066");
    expect(isolateEmbeds("12-Week Reset")).toBe("\u206612-Week Reset\u2069");
    expect(isolateEmbeds("باقة · وفّر 21$")).toContain("\u206621$\u2069");
    expect(isolateEmbeds("راسل glarz.com@gmail.com من")).toContain("\u2066glarz.com@gmail.com\u2069");
    expect(isolateEmbeds("على zatca.gov.sa اليوم")).toContain("\u2066zatca.gov.sa\u2069");
    expect(isolateEmbeds("ملف PDF")).toBe("ملف PDF");
    expect(isolateEmbeds("مدى · بطاقة · Apple Pay · STC Pay")).toContain("\u2066Apple Pay · STC Pay\u2069");
    expect(isolateEmbeds(lede)).toBe(lede);
    const guide = products.find((product) => product.slug === "saudi-freelancer-starter-kit");
    expect(guide).toBeTruthy();
    const localized = localizeProduct(guide!, "ar");
    const answer = localized.faqs.find((faq) => faq.answer.includes("zatca"))?.answer ?? "";
    expect(answer).toContain("\u2066zatca.gov.sa.\u2069");
    expect(stripBidiIsolates(answer)).toBe(arProducts[guide!.slug].faqs.find((faq) => faq.answer.includes("zatca"))?.answer);
    expect(productSchema(guide!, "https://example.com", "ar").name).not.toContain("\u2066");
  });

  it("builds locale paths without doubling a prefix", () => {
    expect(localePath("ar", "/en/shop?category=health")).toBe("/ar/shop?category=health");
    expect(localePath("en", "/")).toBe("/en");
  });
});

function walk(en: unknown, ar: unknown, path: string, mismatches: string[]) {
  if (typeof en === "function") {
    if (typeof ar !== "function") mismatches.push(`${path} should be a function`);
    return;
  }
  if (Array.isArray(en)) {
    if (!Array.isArray(ar) || ar.length !== en.length) mismatches.push(`${path} length`);
    en.forEach((item, index) => {
      if (item && typeof item === "object") walk(item, Array.isArray(ar) ? ar[index] : undefined, `${path}[${index}]`, mismatches);
    });
    return;
  }
  if (en && typeof en === "object") {
    const enKeys = Object.keys(en as object).sort();
    const arKeys = ar && typeof ar === "object" && !Array.isArray(ar) ? Object.keys(ar as object).sort() : [];
    if (enKeys.join("|") !== arKeys.join("|")) mismatches.push(`${path} keys`);
    for (const key of enKeys) {
      walk((en as Record<string, unknown>)[key], (ar as Record<string, unknown> | undefined)?.[key], path ? `${path}.${key}` : key, mismatches);
    }
  }
}
