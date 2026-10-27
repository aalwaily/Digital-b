import sitemap from "@/app/sitemap";
import { posts } from "@/data/blog";
import { legalPages } from "@/data/legal";
import { categories, products } from "@/data/products";
import { blogHreflang, blogIndex, blogLocalesForSlug } from "@/lib/blog-index";
import { localePath, type Locale } from "@/lib/i18n/config";
import { languageAlternate } from "@/lib/locale-path";
import { articleHref, pageExists, productsShopTarget, unprefixedTarget } from "@/lib/routes";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import { describe, expect, it } from "vitest";

function indexablePaths() {
  const paths: string[] = [];
  const staticPaths = ["/", "/shop", "/about", "/contact", "/faq", "/blog"];
  for (const locale of ["en", "ar"] as const) {
    for (const path of staticPaths) paths.push(localePath(locale, path));
    for (const category of categories) paths.push(localePath(locale, `/shop/${category.slug}`));
    for (const product of products) paths.push(localePath(locale, `/product/${product.slug}`));
    for (const page of legalPages) paths.push(localePath(locale, `/legal/${page.slug}`));
  }
  for (const post of posts) {
    const locales: Locale[] = post.lang === "ar" ? ["ar"] : post.lang === "en" ? ["en"] : ["en", "ar"];
    for (const locale of locales) paths.push(localePath(locale, `/blog/${post.slug}`));
  }
  return paths;
}

describe("public routes", () => {
  it("keeps the journal route index aligned with the essays", () => {
    expect(blogIndex.map((entry) => entry.slug).sort()).toEqual(posts.map((post) => post.slug).sort());
    for (const post of posts) {
      const entry = blogIndex.find((item) => item.slug === post.slug);
      expect(entry?.lang, post.slug).toBe(post.lang);
      expect(entry?.translationOf, post.slug).toBe(post.translationOf);
      const locales: Locale[] = post.lang === "ar" ? ["ar"] : post.lang === "en" ? ["en"] : ["en", "ar"];
      expect(blogLocalesForSlug(post.slug)).toEqual(locales);
    }
  });

  it("lists every real public page once, with hreflang that also exists", () => {
    const expected = indexablePaths();
    const entries = sitemap();
    const urls = entries.map((entry) => new URL(entry.url).pathname);
    expect(urls.sort()).toEqual([...expected].sort());
    expect(new Set(urls).size).toBe(urls.length);
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.keys(languages).length).toBeGreaterThan(0);
      for (const href of Object.values(languages)) {
        expect(href.startsWith(CANONICAL_ORIGIN)).toBe(true);
        const path = new URL(href).pathname;
        expect(expected, href).toContain(path);
      }
    }
    expect(urls.some((url) => url.includes("/checkout") || url.includes("/cart") || url.includes("/orders"))).toBe(false);
  });

  it("switches articles onto the translation, or the journal when there is no translation", () => {
    expect(languageAlternate("/en/blog/ats-cv-template-saudi-jobs").href).toBe("/ar/blog/qalb-sira-ats");
    expect(languageAlternate("/ar/blog/qalb-sira-ats").href).toBe("/en/blog/ats-cv-template-saudi-jobs");
    expect(languageAlternate("/en/blog/freelance-budget-template-irregular-income").href).toBe("/ar/blog");
    expect(languageAlternate("/ar/blog/khitat-nuzul-al-wazn").href).toBe("/en/blog/fat-loss-meal-plan-pdf");
    expect(languageAlternate("/en/blog/sunday-prep-that-holds").href).toBe("/ar/blog/sunday-prep-that-holds");
    expect(languageAlternate("/ar/product/the-quiet-budget").href).toBe("/en/product/the-quiet-budget");
    for (const path of indexablePaths()) {
      const alternate = languageAlternate(path);
      expect(pageExists(alternate.href, alternate.lang), `${path} -> ${alternate.href}`).toBe(true);
    }
  });

  it("does not advertise a missing locale in journal hreflang", () => {
    expect(blogHreflang("freelance-budget-template-irregular-income")).toEqual({
      en: "/en/blog/freelance-budget-template-irregular-income",
      "x-default": "/en/blog/freelance-budget-template-irregular-income",
    });
    expect(blogHreflang("ats-cv-template-saudi-jobs")).toEqual({
      en: "/en/blog/ats-cv-template-saudi-jobs",
      ar: "/ar/blog/qalb-sira-ats",
      "x-default": "/en/blog/ats-cv-template-saudi-jobs",
    });
    expect(blogHreflang("sunday-prep-that-holds")).toEqual({
      en: "/en/blog/sunday-prep-that-holds",
      ar: "/ar/blog/sunday-prep-that-holds",
      "x-default": "/en/blog/sunday-prep-that-holds",
    });
  });

  it("resolves in-article links onto pages that exist", () => {
    for (const post of posts) {
      for (const block of post.blocks) {
        if (block.type !== "links") continue;
        for (const item of block.items) {
          if (/^https?:\/\//i.test(item.href)) continue;
          const href = articleHref(item.href);
          const locale = href.startsWith("/ar") ? "ar" : "en";
          expect(pageExists(href, locale), `${post.slug} ${item.href} -> ${href}`).toBe(true);
        }
      }
    }
    expect(articleHref("/blog/qalb-sira-ats")).toBe("/ar/blog/qalb-sira-ats");
    expect(articleHref("/blog/ats-cv-template-saudi-jobs")).toBe("/en/blog/ats-cv-template-saudi-jobs");
    expect(articleHref("/product/gulf-ats-cv-kit")).toBe("/en/product/gulf-ats-cv-kit");
  });

  it("sends unprefixed urls to a real locale page and leaves unknown urls unmatched", () => {
    expect(unprefixedTarget("/shop", "ar")).toEqual({ locale: "ar", pathname: "/ar/shop" });
    expect(unprefixedTarget("/shop/health", "ar")).toEqual({ locale: "ar", pathname: "/ar/shop/health" });
    expect(unprefixedTarget("/shop/not-a-category", "en")).toBeNull();
    expect(pageExists("/en/shop/finance", "en")).toBe(true);
    expect(unprefixedTarget("/product/steady-mind", "en")).toEqual({
      locale: "en",
      pathname: "/en/product/steady-mind",
    });
    expect(unprefixedTarget("/blog/qalb-sira-ats", "en")).toEqual({
      locale: "ar",
      pathname: "/ar/blog/qalb-sira-ats",
    });
    expect(unprefixedTarget("/blog/freelance-budget-template-irregular-income", "ar")).toEqual({
      locale: "en",
      pathname: "/en/blog/freelance-budget-template-irregular-income",
    });
    expect(unprefixedTarget("/blog/sunday-prep-that-holds", "ar")).toEqual({
      locale: "ar",
      pathname: "/ar/blog/sunday-prep-that-holds",
    });
    expect(unprefixedTarget("/orders/abc", "ar")).toEqual({ locale: "ar", pathname: "/ar/orders/abc" });
    expect(unprefixedTarget("/product/not-a-guide", "en")).toBeNull();
    expect(unprefixedTarget("/blog/not-an-article", "ar")).toBeNull();
    expect(unprefixedTarget("/legal/not-a-policy", "en")).toBeNull();
    expect(unprefixedTarget("/missing", "en")).toBeNull();
    expect(pageExists("/en/blog/qalb-sira-ats", "en")).toBe(false);
    expect(pageExists("/ar/blog/qalb-sira-ats", "ar")).toBe(true);
    expect(pageExists("/en/product/steady-mind/opengraph-image", "en")).toBe(true);
    expect(pageExists("/en/product/not-a-guide/opengraph-image", "en")).toBe(false);
    expect(pageExists("/en/opengraph-image", "en")).toBe(true);
    expect(pageExists("/ar/opengraph-image", "ar")).toBe(true);
  });

  it("sends /products to the shop in one hop", () => {
    expect(productsShopTarget("/products", "ar")).toBe("/ar/shop");
    expect(productsShopTarget("/products/", "en")).toBe("/en/shop");
    expect(productsShopTarget("/en/products", "ar")).toBe("/en/shop");
    expect(productsShopTarget("/en/products/", "ar")).toBe("/en/shop");
    expect(productsShopTarget("/ar/products", "en")).toBe("/ar/shop");
    expect(productsShopTarget("/ar/products/", "en")).toBe("/ar/shop");
    expect(productsShopTarget("/products/extra", "en")).toBeNull();
    expect(productsShopTarget("/en/shop", "en")).toBeNull();
    expect(pageExists("/en/products", "en")).toBe(false);
    expect(pageExists("/ar/products", "ar")).toBe(false);
    expect(unprefixedTarget("/products", "en")).toBeNull();

    function respond(path: string, init?: { cookie?: string; accept?: string; ua?: string }) {
      const headers = new Headers();
      if (init?.cookie) headers.set("cookie", `vellum_locale=${init.cookie}`);
      if (init?.accept) headers.set("accept-language", init.accept);
      if (init?.ua) headers.set("user-agent", init.ua);
      return middleware(new NextRequest(new URL(path, "http://127.0.0.1:43123"), { headers }));
    }
    function location(path: string, init?: { cookie?: string; accept?: string; ua?: string }) {
      const response = respond(path, init);
      expect(response.status).toBe(301);
      return new URL(response.headers.get("location") || "http://127.0.0.1:43123/").pathname;
    }

    const human = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    const bot = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
    expect(location("/products", { accept: "ar-SA,ar;q=0.9", ua: human })).toBe("/ar/shop");
    expect(location("/products/", { accept: "en-US,en;q=0.8", ua: human })).toBe("/en/shop");
    expect(location("/products", { cookie: "en", accept: "ar", ua: human })).toBe("/en/shop");
    expect(location("/products", { cookie: "ar", accept: "en", ua: human })).toBe("/ar/shop");
    expect(location("/products", { cookie: "ar", accept: "ar", ua: bot })).toBe("/en/shop");
    expect(location("/products/", { accept: "ar", ua: bot })).toBe("/en/shop");
    expect(location("/en/products", { cookie: "ar", accept: "ar", ua: human })).toBe("/en/shop");
    expect(location("/en/products/", { cookie: "ar", ua: bot })).toBe("/en/shop");
    expect(location("/ar/products", { cookie: "en", accept: "en", ua: human })).toBe("/ar/shop");
    expect(location("/ar/products/", { accept: "en", ua: bot })).toBe("/ar/shop");
    const withQuery = new URL(respond("/products/?q=1", { accept: "en", ua: human }).headers.get("location") || "http://127.0.0.1/");
    expect(withQuery.pathname).toBe("/en/shop");
    expect(withQuery.search).toBe("?q=1");

    const slashedShop = respond("/en/shop/", { ua: human });
    expect(slashedShop.status).toBe(308);
    expect(new URL(slashedShop.headers.get("location") || "http://127.0.0.1:43123/").pathname).toBe("/en/shop");

    const shop = respond("/en/shop", { ua: human });
    expect(shop.status).not.toBe(301);
    expect(shop.headers.get("location")).toBeNull();
    expect(location("/shop", { accept: "en", ua: human })).toBe("/en/shop");
    expect(respond("/shop", { accept: "ar", ua: bot }).status).not.toBe(301);
  });

  it("keeps a share image route for every indexable page, including home", () => {
    for (const path of indexablePaths()) {
      const locale = path.startsWith("/ar") ? "ar" : "en";
      expect(pageExists(`${path}/opengraph-image`, locale), path).toBe(true);
    }
  });
});
