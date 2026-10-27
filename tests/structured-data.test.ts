import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { posts } from "@/data/blog";
import { categories, products } from "@/data/products";
import { stripBidiIsolates } from "@/lib/i18n/bidi";
import { localePath, stripLocale, type Locale } from "@/lib/i18n/config";
import { localizeProduct, visibleHomeFaqs, localizeFaqs } from "@/lib/i18n/content";
import { struckPrice } from "@/lib/money";
import { pageMetadata } from "@/lib/page-meta";
import { jsonLdTypes, pageJsonLd } from "@/lib/page-jsonld";
import { publicMetadata } from "@/lib/public-meta";
import { offerAvailability, productSchema } from "@/lib/schema";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/seo";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ARABIC = /\p{Script=Arabic}/u;
const LOCALES = ["en", "ar"] as const;

function absolute(href: string) {
  return href.startsWith("http") ? href : canonicalUrl(href);
}

function languagesOf(meta: NonNullable<ReturnType<typeof publicMetadata>>) {
  const rendered = pageMetadata(meta);
  const languages = rendered.alternates?.languages ?? {};
  return Object.fromEntries(Object.entries(languages).map(([lang, href]) => [lang, absolute(String(href))]));
}

describe("product JSON-LD", () => {
  it("matches the catalog price and stays free of invented reviews", () => {
    for (const product of products) {
      for (const locale of LOCALES) {
        const schema = productSchema(product, CANONICAL_ORIGIN, locale);
        const localized = localizeProduct(product, locale);
        const types = Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"]];
        expect(types, product.slug).toContain("Product");
        expect(schema.name).toBe(stripBidiIsolates(localized.title));
        expect(schema.description).toBe(stripBidiIsolates(localized.shortDescription));
        expect(schema.inLanguage).toBe(locale);
        expect(schema.url).toBe(`${CANONICAL_ORIGIN}${localePath(locale, `/product/${product.slug}`)}`);
        expect(schema.brand).toMatchObject({ "@type": "Brand", name: "Vellum Press" });
        expect(schema.image.length).toBeGreaterThan(0);
        for (const image of schema.image) {
          expect(image.startsWith(`${CANONICAL_ORIGIN}/`), image).toBe(true);
        }
        if (product.kind === "guide") {
          expect(schema.image[0]).toBe(`${CANONICAL_ORIGIN}/previews/${product.slug}.png`);
        }
        expect(schema.offers.price).toBe(product.price.toFixed(2));
        expect(schema.offers.priceCurrency).toBe("USD");
        expect(schema.offers.availability).toBe(offerAvailability());
        expect(["https://schema.org/InStock", "https://schema.org/OutOfStock"]).toContain(schema.offers.availability);
        expect(schema.offers.url).toBe(schema.url);
        expect(schema.offers.itemCondition).toBe("https://schema.org/NewCondition");
        expect(schema.offers).not.toHaveProperty("shippingDetails");
        const struck = struckPrice(product.price, product.previousPrice, product.compareAtPrice);
        if (struck == null) {
          expect(schema.offers.priceSpecification).toBeUndefined();
        } else {
          expect(schema.offers.priceSpecification).toMatchObject({
            price: struck.toFixed(2),
            priceCurrency: "USD",
            priceType: "https://schema.org/StrikethroughPrice",
          });
        }
        expect(schema.offers.hasMerchantReturnPolicy).toMatchObject({
          "@type": "MerchantReturnPolicy",
          applicableCountry: "SA",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
          merchantReturnLink: `${CANONICAL_ORIGIN}${localePath(locale, "/legal/refunds")}`,
        });
        const blob = JSON.stringify(schema);
        expect(blob).not.toMatch(/aggregateRating|reviewCount|ratingValue|"review"/);
        if (locale === "ar") expect(schema.name).toMatch(ARABIC);
        else expect(schema.name).not.toMatch(ARABIC);
      }
    }
  });
});

describe("JSON-LD per page type", () => {
  it("puts FAQPage only where the questions are on the page", () => {
    for (const locale of LOCALES) {
      const home = pageJsonLd(locale, "/");
      expect(jsonLdTypes(home)).toEqual(expect.arrayContaining(["WebSite", "Organization", "FAQPage"]));
      const homeFaq = home.find((entry) => (entry as { "@type": string })["@type"] === "FAQPage") as {
        mainEntity: { name: string }[];
      };
      expect(homeFaq.mainEntity.map((item) => item.name)).toEqual(
        visibleHomeFaqs(locale).map((item) => stripBidiIsolates(item.question)),
      );

      const faq = pageJsonLd(locale, "/faq");
      expect(jsonLdTypes(faq)).toEqual(["FAQPage"]);
      expect((faq[0] as { mainEntity: unknown[] }).mainEntity).toHaveLength(localizeFaqs(locale).length);

      expect(jsonLdTypes(pageJsonLd(locale, "/shop"))).not.toContain("FAQPage");
      expect(jsonLdTypes(pageJsonLd(locale, "/about"))).toEqual([]);
      expect(jsonLdTypes(pageJsonLd(locale, "/contact"))).toEqual([]);
      expect(jsonLdTypes(pageJsonLd(locale, "/blog"))).toEqual([]);

      for (const category of categories) {
        const data = pageJsonLd(locale, `/shop/${category.slug}`);
        expect(jsonLdTypes(data), category.slug).toEqual(["BreadcrumbList", "ItemList"]);
        const list = data[1] as { numberOfItems: number };
        expect(list.numberOfItems).toBe(products.filter((product) => product.category === category.slug).length);
      }

      for (const product of products) {
        const data = pageJsonLd(locale, `/product/${product.slug}`);
        expect(jsonLdTypes(data), product.slug).toEqual(
          expect.arrayContaining(["Product", "DigitalDocument", "FAQPage", "BreadcrumbList"]),
        );
        const crumbs = data.find((entry) => (entry as { "@type": string })["@type"] === "BreadcrumbList") as {
          itemListElement: { position: number; name: string; item: string }[];
        };
        expect(crumbs.itemListElement.map((item) => item.position)).toEqual([1, 2, 3, 4]);
        expect(crumbs.itemListElement[2].item).toBe(
          `${CANONICAL_ORIGIN}${localePath(locale, `/shop/${product.category}`)}`,
        );
        const questions = data.find((entry) => (entry as { "@type": string })["@type"] === "FAQPage") as {
          mainEntity: { name: string; acceptedAnswer: { text: string } }[];
        };
        const localized = localizeProduct(product, locale);
        expect(questions.mainEntity.map((item) => item.name)).toEqual(
          localized.faqs.map((item) => stripBidiIsolates(item.question)),
        );
      }

      for (const post of posts) {
        const locales: Locale[] = post.lang === "ar" ? ["ar"] : post.lang === "en" ? ["en"] : ["en", "ar"];
        if (!locales.includes(locale)) continue;
        const data = pageJsonLd(locale, `/blog/${post.slug}`);
        expect(jsonLdTypes(data), post.slug).toEqual(["Article", "BreadcrumbList"]);
      }
    }
  });

  it("publishes one organization logo and a no-returns policy, with no shipping fiction", () => {
    const bytes = fs.readFileSync(path.join(process.cwd(), "public/logo.png"));
    expect(bytes.subarray(1, 4).toString()).toBe("PNG");
    expect(bytes.readUInt32BE(16)).toBe(512);
    expect(bytes.readUInt32BE(20)).toBe(512);
    for (const locale of LOCALES) {
      const org = pageJsonLd(locale, "/").find((entry) => (entry as { "@type": string })["@type"] === "Organization") as {
        logo: { url: string; width: number; height: number };
        hasMerchantReturnPolicy: { applicableCountry: string; returnPolicyCategory: string };
      };
      expect(org.logo).toMatchObject({
        url: `${CANONICAL_ORIGIN}/logo.png`,
        width: 512,
        height: 512,
      });
      expect(org.hasMerchantReturnPolicy.applicableCountry).toBe("SA");
      expect(org.hasMerchantReturnPolicy.returnPolicyCategory).toBe("https://schema.org/MerchantReturnNotPermitted");
      expect(JSON.stringify(pageJsonLd(locale, "/"))).not.toMatch(/shippingDetails|OfferShippingDetails/);
    }
  });
});

describe("hreflang, titles, and robots", () => {
  it("keeps sitemap alternates reciprocal and aligned with page metadata", () => {
    const entries = sitemap();
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
    expect(entries.length).toBeGreaterThan(0);
    const titles = new Map<Locale, string[]>();
    const descriptions = new Map<Locale, string[]>();

    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      const pathname = new URL(entry.url).pathname;
      const locale = pathname.split("/")[1] as Locale;
      const bare = stripLocale(pathname);
      const meta = publicMetadata(locale, bare);
      expect(meta, pathname).toBeTruthy();
      expect(meta!.index, pathname).toBe(true);
      expect(meta!.locale).toBe(locale);
      const rendered = pageMetadata(meta!);
      expect(rendered.alternates?.canonical).toBe(pathname);
      expect(rendered.openGraph?.locale).toBe(locale === "ar" ? "ar_SA" : "en_US");
      expect(rendered.description).toBe(meta!.description);
      expect([...meta!.title].length, meta!.title).toBeLessThan(60);
      expect([...meta!.description].length, pathname).toBeLessThan(155);
      expect(meta!.description.length, pathname).toBeGreaterThan(40);
      if (locale === "ar") {
        expect(meta!.title, pathname).toMatch(ARABIC);
        expect(meta!.description, pathname).toMatch(ARABIC);
      } else {
        expect(meta!.title, pathname).not.toMatch(ARABIC);
      }

      const fromPage = languagesOf(meta!);
      const fromSitemap = Object.fromEntries(
        Object.entries(entry.alternates?.languages ?? {}).map(([lang, href]) => [lang, String(href)]),
      );
      expect(fromPage, pathname).toEqual(fromSitemap);
      expect(fromSitemap["x-default"], pathname).toBeTruthy();
      expect(fromSitemap[locale], pathname).toBe(entry.url);

      for (const [lang, href] of Object.entries(fromSitemap)) {
        if (lang === "x-default") {
          expect(Object.values(fromSitemap)).toContain(href);
          continue;
        }
        const other = byUrl.get(href);
        expect(other, `${pathname} -> ${href}`).toBeTruthy();
        expect(other!.alternates?.languages).toEqual(entry.alternates?.languages);
      }

      titles.set(locale, [...(titles.get(locale) ?? []), meta!.title]);
      descriptions.set(locale, [...(descriptions.get(locale) ?? []), meta!.description]);
    }

    for (const locale of LOCALES) {
      const titleList = titles.get(locale) ?? [];
      const descriptionList = descriptions.get(locale) ?? [];
      expect(new Set(titleList).size, locale).toBe(titleList.length);
      expect(new Set(descriptionList).size, locale).toBe(descriptionList.length);
    }

    for (const path of ["/cart", "/checkout", "/checkout/success", "/orders"]) {
      for (const locale of LOCALES) {
        const meta = publicMetadata(locale, path);
        expect(meta?.index).toBe(false);
        const rendered = pageMetadata({ ...meta!, path: path === "/orders" ? "/orders/example" : path });
        expect(rendered.robots).toMatchObject({ index: false, follow: false });
        expect(rendered.alternates?.languages).toBeUndefined();
        expect(rendered.openGraph?.locale).toBe(locale === "ar" ? "ar_SA" : "en_US");
      }
    }
    const urls = entries.map((entry) => entry.url);
    expect(urls.some((url) => /\/(cart|checkout|orders)(\/|$)/.test(new URL(url).pathname))).toBe(false);
  });

  it("points robots.txt at the sitemap and keeps checkout out", () => {
    const rules = robots();
    expect(rules.sitemap).toBe(`${CANONICAL_ORIGIN}/sitemap.xml`);
    const disallow = Array.isArray(rules.rules) ? rules.rules.flatMap((rule) => rule.disallow ?? []) : rules.rules?.disallow ?? [];
    const list = Array.isArray(disallow) ? disallow : [disallow];
    for (const path of ["/cart", "/checkout", "/orders/", "/api/", "/en/cart", "/en/checkout", "/en/orders/", "/ar/cart", "/ar/checkout", "/ar/orders/"]) {
      expect(list).toContain(path);
    }
  });
});
