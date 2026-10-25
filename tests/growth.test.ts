import { POST as newsletterPost } from "@/app/(store)/api/newsletter/route";
import { POST as samplePost } from "@/app/(store)/api/sample/route";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { posts } from "@/data/blog";
import { faqs } from "@/data/faq";
import { getLegalPage } from "@/data/legal";
import { legalNav, site } from "@/data/site";
import { readAnalytics } from "@/lib/analytics";
import { demoCheckoutAllowed, isMoyasarEnabled, isStripeEnabled } from "@/lib/payments";
import { articleSchema, faqSchema } from "@/lib/schema";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ENV_KEYS = [
  "ENABLE_STRIPE",
  "ENABLE_MOYASAR",
  "STRIPE_SECRET_KEY",
  "PAYMENT_PROVIDER",
  "MOYASAR_PUBLISHABLE_KEY",
  "MOYASAR_SECRET_KEY",
  "ALLOW_DEMO_CHECKOUT",
  "NEWSLETTER_WEBHOOK_URL",
  "NEXT_PUBLIC_GA_ID",
  "NEXT_PUBLIC_META_PIXEL_ID",
  "NEXT_PUBLIC_TIKTOK_PIXEL_ID",
] as const;

const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) saved[key] = process.env[key];
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("contact address", () => {
  it("uses the owner inbox instead of example addresses", () => {
    expect(site.email).toBe("glarz.com@gmail.com");
    expect(site.supportEmail).toBe("glarz.com@gmail.com");
    expect(site.email.includes(".example")).toBe(false);
    expect(site.legalName).toBe("Vellum Press");
    expect(site.location).toBe("Dammam, Saudi Arabia");
    expect(site.jurisdiction).toBe("the Kingdom of Saudi Arabia");
  });
});

describe("payment flags", () => {
  it("keeps Stripe and Moyasar hidden unless their flags are exactly true", () => {
    delete process.env.PAYMENT_PROVIDER;
    delete process.env.ALLOW_DEMO_CHECKOUT;
    process.env.STRIPE_SECRET_KEY = "sk_test_stripe";
    process.env.MOYASAR_PUBLISHABLE_KEY = "pk_test_publishablekey";
    process.env.MOYASAR_SECRET_KEY = "sk_test_secretkey";
    delete process.env.ENABLE_STRIPE;
    delete process.env.ENABLE_MOYASAR;
    expect(isStripeEnabled()).toBe(false);
    expect(isMoyasarEnabled()).toBe(false);
    expect(demoCheckoutAllowed()).toBe(false);

    process.env.ENABLE_STRIPE = "false";
    process.env.ENABLE_MOYASAR = "1";
    expect(isStripeEnabled()).toBe(false);
    expect(isMoyasarEnabled()).toBe(false);

    process.env.ALLOW_DEMO_CHECKOUT = "true";
    expect(demoCheckoutAllowed()).toBe(true);
    delete process.env.ALLOW_DEMO_CHECKOUT;
    expect(demoCheckoutAllowed()).toBe(false);

    process.env.ENABLE_STRIPE = "true";
    expect(isStripeEnabled()).toBe(true);
    expect(demoCheckoutAllowed()).toBe(false);
    delete process.env.ENABLE_STRIPE;
    process.env.ENABLE_MOYASAR = "true";
    expect(isMoyasarEnabled()).toBe(true);
    expect(demoCheckoutAllowed()).toBe(false);
  });
});

describe("analytics ids", () => {
  it("loads only well-formed public ids", () => {
    expect(
      readAnalytics({
        NEXT_PUBLIC_GA_ID: " G-ABC123 ",
        NEXT_PUBLIC_META_PIXEL_ID: "1234567890",
        NEXT_PUBLIC_TIKTOK_PIXEL_ID: "CABCDEFG12345678",
      } as NodeJS.ProcessEnv),
    ).toEqual({
      gaId: "G-ABC123",
      metaPixelId: "1234567890",
      tiktokPixelId: "CABCDEFG12345678",
    });
    expect(
      readAnalytics({
        NEXT_PUBLIC_GA_ID: "not-an-id",
        NEXT_PUBLIC_META_PIXEL_ID: "pixel",
        NEXT_PUBLIC_TIKTOK_PIXEL_ID: "short",
      } as NodeJS.ProcessEnv),
    ).toEqual({ gaId: null, metaPixelId: null, tiktokPixelId: null });
  });
});

describe("all sales final", () => {
  it("states the policy in the FAQ, legal page, nav label, and sitemap", () => {
    const policy = getLegalPage("refunds");
    expect(policy?.title).toBe("All sales are final");
    expect(policy?.description).toContain(site.email);
    expect(policy?.description.toLowerCase()).toContain("no refunds");
    const policyText = policy?.sections.map((section) => section.paragraphs.join(" ")).join("\n") ?? "";
    expect(policyText).toContain("All sales are final");
    expect(policyText).toContain(site.email);
    expect(policyText.toLowerCase()).toContain("corrupted, missing, or the download link fails");

    const refundFaq = faqs.find((item) => item.question === "Can I get a refund?");
    expect(refundFaq?.answer).toContain("All sales are final");
    expect(refundFaq?.answer).toContain(site.email);
    const faqLd = JSON.stringify(faqSchema(faqs));
    expect(faqLd).toContain("All sales are final");
    expect(faqLd).not.toMatch(/30-day|30 day|money-back|refund window/i);

    expect(legalNav.find((item) => item.href === "/legal/refunds")?.label).toBe("All sales final");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith("/legal/refunds"))).toBe(true);
  });

  it("does not promise a refund window anywhere in customer-facing copy", () => {
    const roots = ["app", "components", "data", "lib", "README.md"];
    const banned = [/30-day/i, /30 day/i, /money-back/i, /money back/i, /refund window/i, /refundDays/];
    const hits: string[] = [];
    for (const root of roots) {
      const full = path.join(process.cwd(), root);
      const files = fs.statSync(full).isDirectory()
        ? walk(full)
        : [full];
      for (const file of files) {
        if (!/\.(tsx?|md|json)$/.test(file)) continue;
        const text = fs.readFileSync(file, "utf8");
        for (const pattern of banned) {
          if (pattern.test(text)) hits.push(`${path.relative(process.cwd(), file)} matches ${pattern}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

describe("search and article metadata", () => {
  it("lists public pages in the sitemap and keeps checkout out of the index", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith("/product/steady-mind"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/product/saudi-freelancer-starter-kit"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/product/irregular-income-budget"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/product/gulf-ats-cv-kit"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/product/gulf-work-bundle"))).toBe(true);
    expect(urls.every((url) => url.startsWith("http://") || url.startsWith("https://"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/blog/sunday-prep-that-holds"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/legal/refunds"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/checkout"))).toBe(false);
    const rules = robots();
    expect(rules.sitemap).toMatch(/\/sitemap\.xml$/);
    const disallow = Array.isArray(rules.rules) ? rules.rules[0]?.disallow : rules.rules.disallow;
    expect(disallow).toEqual(expect.arrayContaining(["/checkout", "/cart", "/orders/", "/api/"]));
  });

  it("describes a journal post as an article without a rating", () => {
    const schema = articleSchema(posts[0], "https://guides.example.com");
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe(posts[0].title);
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema.mainEntityOfPage).toBe(`https://guides.example.com/en/blog/${posts[0].slug}`);
  });
});

describe("newsletter and sample leads", () => {
  it("logs a newsletter signup when no webhook is set", async () => {
    delete process.env.NEWSLETTER_WEBHOOK_URL;
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const response = await newsletterPost(
      new Request("http://127.0.0.1/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "reader@example.com" }),
      }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, stored: "log" });
    expect(spy.mock.calls.map((call) => String(call[0])).join("\n")).toContain("reader@example.com");
  });

  it("unlocks a sample PDF after the email is recorded", async () => {
    delete process.env.NEWSLETTER_WEBHOOK_URL;
    vi.spyOn(console, "info").mockImplementation(() => {});
    const response = await samplePost(
      new Request("http://127.0.0.1/api/sample", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "reader@example.com", slug: "steady-mind" }),
      }),
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { stored: string; downloads: { href: string }[] };
    expect(body.stored).toBe("log");
    expect(body.downloads[0]?.href).toBe("/samples/steady-mind-sample.pdf");
  });

  it("rejects a sample request without a real guide", async () => {
    const response = await samplePost(
      new Request("http://127.0.0.1/api/sample", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "reader@example.com", slug: "not-a-guide" }),
      }),
    );
    expect(response.status).toBe(404);
  });
});
