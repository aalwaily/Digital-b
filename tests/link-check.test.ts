import { site } from "@/data/site";
import {
  alternateTarget,
  assetTypeIssue,
  canonicalIssue,
  classifyReference,
  collectDocument,
  CONTACT_EMAIL,
  cssUrls,
  externalIssue,
  hreflangClusterIssues,
  hreflangMismatch,
  mailtoIssue,
  parseSitemap,
  permanentRedirect,
  sampleForPreview,
  whatsAppIssue,
} from "../scripts/link-rules.mjs";
import { describe, expect, it } from "vitest";

const base = "http://127.0.0.1:43991";
const arabicPage = `${base}/ar/blog/wathiqat-al-amal-al-hur`;

describe("link check rules", () => {
  it("keeps the contact address on glarz.com@gmail.com", () => {
    expect(CONTACT_EMAIL).toBe("glarz.com@gmail.com");
    expect(site.email).toBe(CONTACT_EMAIL);
    expect(site.supportEmail).toBe(CONTACT_EMAIL);
  });

  it("rejects the old /products path and names the shop it redirects to", () => {
    const english = classifyReference("/en/products", `${base}/en/faq`, base);
    const arabic = classifyReference("/products", arabicPage, base);
    const shop = classifyReference("https://getvellumpress.com/ar/shop", arabicPage, base);
    expect(english.kind).toBe("bad");
    expect(english.issue).toContain("/en/shop");
    expect(arabic.kind).toBe("bad");
    expect(arabic.issue).toContain("/ar/shop");
    expect(shop.kind).toBe("internal");
    expect(shop.localUrl).toBe(`${base}/ar/shop`);
  });

  it("checks mailto and WhatsApp shape without calling the network", () => {
    expect(mailtoIssue("mailto:glarz.com@gmail.com")).toBeNull();
    expect(mailtoIssue("mailto:glarz.com@gmail.com?subject=Request")).toBeNull();
    expect(mailtoIssue("mailto:?subject=Share&body=https%3A%2F%2Fgetvellumpress.com%2Fen")).toBeNull();
    expect(mailtoIssue("mailto:other@example.com")).toMatch(/glarz.com@gmail.com/);
    expect(mailtoIssue("mailto:not-an-email")).toMatch(/malformed/);
    expect(whatsAppIssue("https://wa.me/966509309787?s=p")).toBeNull();
    expect(whatsAppIssue("https://wa.me/?text=Hello")).toBeNull();
    expect(whatsAppIssue("http://wa.me/966509309787")).toMatch(/https/);
    expect(whatsAppIssue("https://wa.me/not-a-phone")).toMatch(/malformed/);
    expect(externalIssue("https://freelance.sa/")).toBeNull();
    expect(externalIssue("http://example.com/guide")).toMatch(/https/);
    expect(classifyReference("http://example.com/guide", arabicPage, base).kind).toBe("bad");
    expect(classifyReference("https://example.com/guide", arabicPage, base).kind).toBe("external");
  });

  it("requires a canonical on the page's own language version", () => {
    expect(canonicalIssue(`${base}/ar/shop`, "https://getvellumpress.com/ar/shop", base)).toBeNull();
    expect(canonicalIssue(`${base}/ar/shop`, "https://getvellumpress.com/en/shop", base)).toMatch(/en version/);
    expect(canonicalIssue(`${base}/en/product/steady-mind`, "https://getvellumpress.com/en/shop", base)).toMatch(/does not match/);
    expect(canonicalIssue(`${base}/en`, "http://127.0.0.1:43991/en", base)).toMatch(/not getvellumpress.com/);
    expect(alternateTarget("https://getvellumpress.com/ar/shop", `${base}/en/shop`, base).path).toBe("/ar/shop");
  });

  it("requires reciprocal hreflang sets", () => {
    const paired = {
      en: "/en/blog/ats-cv-template-saudi-jobs",
      ar: "/ar/blog/qalb-sira-ats",
      "x-default": "/en/blog/ats-cv-template-saudi-jobs",
    };
    expect(
      hreflangClusterIssues([
        { path: paired.en, hreflang: paired },
        { path: paired.ar, hreflang: paired },
      ]),
    ).toEqual([]);
    expect(
      hreflangClusterIssues([
        {
          path: "/en/blog/freelance-budget-template-irregular-income",
          hreflang: {
            en: "/en/blog/freelance-budget-template-irregular-income",
            "x-default": "/en/blog/freelance-budget-template-irregular-income",
          },
        },
      ]),
    ).toEqual([]);
    const broken = hreflangClusterIssues([
      { path: "/en/shop", hreflang: { en: "/en/shop", ar: "/ar/shop", "x-default": "/en/shop" } },
      { path: "/ar/shop", hreflang: { en: "/en/shop", ar: "/ar/shop", "x-default": "/ar/shop" } },
    ]);
    expect(broken.some((issue) => issue.includes("x-default"))).toBe(true);
    expect(hreflangMismatch("/en/shop", { en: "/en/shop" }, { en: "/en/shop", ar: "/ar/shop" })[0]).toMatch(/missing/);
  });

  it("pairs a preview image with its sample PDF and allows one permanent redirect", () => {
    expect(sampleForPreview("/previews/steady-mind.png")).toBe("/samples/steady-mind-sample.pdf");
    expect(sampleForPreview("/_next/image")).toBeNull();
    expect(permanentRedirect(301)).toBe(true);
    expect(permanentRedirect(308)).toBe(true);
    expect(permanentRedirect(302)).toBe(false);
    expect(assetTypeIssue("download", "text/html; charset=utf-8")).toMatch(/HTML/);
    expect(assetTypeIssue("preview", "image/png")).toBeNull();
    expect(cssUrls('src:url("/_next/static/media/a.woff2") format("woff2")')).toEqual(["/_next/static/media/a.woff2"]);
  });

  it("reads anchors, assets, canonicals, and hreflang from a document", () => {
    const html = `<!DOCTYPE html><html lang="en"><head>
      <title>Shop · Vellum Press</title>
      <link rel="canonical" href="https://getvellumpress.com/en/shop">
      <link rel="alternate" hreflang="en" href="https://getvellumpress.com/en/shop">
      <link rel="alternate" hreflang="ar" href="https://getvellumpress.com/ar/shop">
      <link rel="alternate" hreflang="x-default" href="https://getvellumpress.com/en/shop">
      <link rel="icon" href="/icon?v=1">
      <meta property="og:image" content="https://getvellumpress.com/en/shop/opengraph-image">
      <meta property="og:url" content="https://getvellumpress.com/en/shop">
      </head><body>
      <a href="/en/product/steady-mind">Guide</a>
      <a href="/products">Old catalog</a>
      <a href="mailto:glarz.com@gmail.com">Email</a>
      <a href="https://wa.me/966509309787?s=p">WhatsApp</a>
      <a href="https://freelance.sa/">Official</a>
      <img src="/_next/image?url=%2Fpreviews%2Fsteady-mind.png&amp;w=640&amp;q=75" alt="">
      <style>@font-face{src:url(/_next/static/media/a.woff2)}</style>
      <script type="application/ld+json">{"email":"glarz.com@gmail.com","image":"https://getvellumpress.com/previews/steady-mind.png"}</script>
      </body></html>`;
    const doc = collectDocument(html);
    expect(doc.canonicals).toEqual(["https://getvellumpress.com/en/shop"]);
    expect(doc.hreflang.ar).toBe("https://getvellumpress.com/ar/shop");
    expect(doc.hreflang["x-default"]).toBe("https://getvellumpress.com/en/shop");
    expect(doc.anchors).toContain("/products");
    expect(doc.anchors).toContain("mailto:glarz.com@gmail.com");
    expect(doc.emails).toEqual(["glarz.com@gmail.com"]);
    expect(doc.refs.some((ref) => ref.kind === "favicon" && ref.raw.startsWith("/icon"))).toBe(true);
    expect(doc.refs.some((ref) => ref.kind === "og:image")).toBe(true);
    expect(doc.refs.some((ref) => ref.raw.includes("a.woff2"))).toBe(true);
    expect(doc.refs.some((ref) => ref.raw.includes("/previews/steady-mind.png"))).toBe(true);
    expect(doc.softNotFound).toBe(false);
  });

  it("parses sitemap locs and hreflang alternates", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset>
        <url>
          <loc>https://getvellumpress.com/en/shop</loc>
          <xhtml:link rel="alternate" hreflang="en" href="https://getvellumpress.com/en/shop"/>
          <xhtml:link rel="alternate" hreflang="ar" href="https://getvellumpress.com/ar/shop"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="https://getvellumpress.com/en/shop"/>
        </url>
        <url>
          <loc>https://getvellumpress.com/ar/shop</loc>
          <xhtml:link rel="alternate" hreflang="en" href="https://getvellumpress.com/en/shop"/>
          <xhtml:link rel="alternate" hreflang="ar" href="https://getvellumpress.com/ar/shop"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="https://getvellumpress.com/en/shop"/>
        </url>
      </urlset>`;
    const pages = parseSitemap(xml);
    expect(pages).toHaveLength(2);
    expect(pages[0].alternates.ar).toBe("https://getvellumpress.com/ar/shop");
    expect(pages[1].alternates["x-default"]).toBe("https://getvellumpress.com/en/shop");
  });
});
