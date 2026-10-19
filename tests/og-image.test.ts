import { readFileSync } from "node:fs";
import path from "node:path";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedPost, localizedProduct } from "@/lib/i18n/content";
import { ogArabicFontData, ogContainsArabic } from "@/lib/og-font";
import { renderOgImage } from "@/lib/og-image";
import { describe, expect, it } from "vitest";

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

async function pngBytes(response: Response) {
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("image/png");
  const bytes = Buffer.from(await response.arrayBuffer());
  expect(bytes.subarray(0, 8)).toEqual(PNG);
  expect(bytes.length).toBeGreaterThan(8_000);
  return bytes;
}

describe("arabic open graph font", () => {
  it("vendors an IBM Plex Sans Arabic TTF", () => {
    const file = path.join(process.cwd(), "assets/fonts/IBMPlexSansArabic-Regular.ttf");
    const bytes = readFileSync(file);
    expect(bytes.subarray(0, 4)).toEqual(Buffer.from([0x00, 0x01, 0x00, 0x00]));
    expect(bytes.equals(ogArabicFontData())).toBe(true);
    expect(readFileSync(path.join(process.cwd(), "assets/fonts/OFL.txt"), "utf8")).toMatch(/SIL Open Font License/);
  });

  it("detects Arabic and leaves English on the default font path", () => {
    expect(ogContainsArabic("Practical PDF guides")).toBe(false);
    expect(ogContainsArabic("VELLUM PRESS")).toBe(false);
    expect(ogContainsArabic("تسوق الأدلة")).toBe(true);
    expect(ogContainsArabic("تنزيل فوري")).toBe(true);
  });

  it("renders English and Arabic cards as PNG without a shaping error", async () => {
    const en = getDictionary("en");
    const ar = getDictionary("ar");
    const english = await pngBytes(renderOgImage({ title: en.home.title, deck: en.home.lede }));
    const home = await pngBytes(renderOgImage({ title: ar.home.title, deck: ar.home.lede }));
    const shop = await pngBytes(renderOgImage({ title: ar.shop.title, deck: ar.shop.lede(12, 3) }));
    const post = localizedPost("khitat-nuzul-al-wazn", "ar");
    const article = await pngBytes(
      renderOgImage({
        eyebrow: "المدونة",
        title: post?.title ?? ar.blog.title,
        deck: post?.description ?? ar.blog.lede,
      }),
    );
    const product = localizedProduct("12-week-reset", "ar");
    const guide = await pngBytes(
      renderOgImage({
        title: product?.title ?? "دليل",
        deck: `${product?.subtitle ?? ""} · $29`,
      }),
    );
    expect(new Set([english, home, shop, article, guide].map((item) => item.toString("base64"))).size).toBe(5);
  });
});
