import { readFileSync } from "node:fs";
import zlib from "node:zlib";
import path from "node:path";
import { createElement } from "react";
import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedPost, localizedProduct } from "@/lib/i18n/content";
import { ogArabicFontData, ogArabicFonts, ogContainsArabic } from "@/lib/og-font";
import { renderOgImage } from "@/lib/og-image";
import { OgRtlText, ogRtlChunkText, ogRtlChunks } from "@/lib/og-rtl";
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

  it("keeps logical word order, numbers, and Latin phrases", () => {
    const read = (value: string) => ogRtlChunks(value).map(ogRtlChunkText);
    expect(read("إعادة الضبط في 12 أسبوعًا")).toEqual(["إعادة", "الضبط", "في", "12", "أسبوعًا"]);
    expect(read("خطة ثابتة لخسارة الدهون من غير حمية قاسية")).toEqual([
      "خطة",
      "ثابتة",
      "لخسارة",
      "الدهون",
      "من",
      "غير",
      "حمية",
      "قاسية",
    ]);
    expect(read("تنزيل فوري")).toEqual(["تنزيل", "فوري"]);
    expect(read("تصدر Vellum Press ملفات PDF")).toEqual(["تصدر", "Vellum Press", "ملفات", "PDF"]);
    expect(read("11 ملفات PDF عملية و3 باقات.")).toEqual(["11", "ملفات", "PDF", "عملية", "و3", "باقات."]);
    expect(read("راسل Vellum Press على glarz.com@gmail.com بخصوص")).toEqual([
      "راسل",
      "Vellum Press",
      "على",
      "glarz.com@gmail.com",
      "بخصوص",
    ]);
  });

  it("places the first Arabic word on the right, including a wrapped line", async () => {
    for (const text of [
      "إعادة الضبط في 12 أسبوعًا",
      "تنزيل فوري",
      "أدلة عملية للأكل والتمرين والمال والتركيز.",
      "تصدر Vellum Press ملفات PDF تستطيع أن تنهيها",
    ]) {
      expect(await visualOrder(text, text.length > 20 ? 72 : 48)).toEqual(ogRtlChunks(text).map(ogRtlChunkText));
    }
  });

  it("uses one even gap between Arabic words", async () => {
    const text = "إعادة الضبط في 12 أسبوعًا";
    const fontSize = 72;
    const expected = Math.round(fontSize * 0.28);
    const gaps = await visualGaps(text, fontSize, 1056);
    expect(gaps).toHaveLength(ogRtlChunks(text).length - 1);
    for (const gap of gaps) expect(Math.abs(gap - expected)).toBeLessThanOrEqual(2);

    const lede = "تصدر Vellum Press ملفات PDF تستطيع أن تنهيها";
    const ledeGaps = await visualGaps(lede, 28, 1056);
    const ledeExpected = Math.round(28 * 0.28);
    expect(ledeGaps.length).toBeGreaterThan(3);
    for (const gap of ledeGaps) expect(Math.abs(gap - ledeExpected)).toBeLessThanOrEqual(2);
  });
});

function chunkColor(index: number) {
  const hue = (index * 47) % 360;
  const saturation = 0.85;
  const lightness = 0.55;
  const chroma = saturation * Math.min(lightness, 1 - lightness);
  const channel = (offset: number) => {
    const k = (offset + hue / 30) % 12;
    return Math.round(255 * (lightness - chroma * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  const rgb = [channel(0), channel(8), channel(4)] as const;
  return { rgb, css: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` };
}

async function visualOrder(text: string, fontSize: number) {
  const { chunks, lines } = await layoutBoxes(text, fontSize, 1056);
  return lines.flatMap((line) => line.sort((a, b) => b.x - a.x).map((box) => ogRtlChunkText(chunks[box.index])));
}

async function visualGaps(text: string, fontSize: number, width: number) {
  const { lines } = await layoutBoxes(text, fontSize, width);
  return lines.flatMap((line) => {
    const sorted = line.sort((a, b) => b.maxX - a.maxX);
    const gaps: number[] = [];
    for (let index = 1; index < sorted.length; index++) gaps.push(sorted[index - 1].minX - sorted[index].maxX - 1);
    return gaps;
  });
}

async function layoutBoxes(text: string, fontSize: number, width: number) {
  const chunks = ogRtlChunks(text);
  const colors = chunks.map((_, index) => chunkColor(index));
  const response = new ImageResponse(
    createElement(
      "div",
      { style: { display: "flex", width: "100%", height: "100%", background: "#000", fontFamily: "IBM Plex Sans Arabic" } },
      createElement(OgRtlText, { text, fontSize, chunkColors: colors.map((color) => color.css) }),
    ),
    { width, height: 360, fonts: ogArabicFonts() },
  );
  const png = decodePng(Buffer.from(await response.arrayBuffer()));
  const boxes = colors.map(() => ({ n: 0, y: 0, x: 0, minX: width, maxX: 0 }));
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const offset = (y * png.width + x) * png.bpp;
      const pixel = [png.data[offset], png.data[offset + 1], png.data[offset + 2]];
      const index = colors.findIndex((color) => color.rgb.every((channel, channelIndex) => channel === pixel[channelIndex]));
      if (index < 0) continue;
      boxes[index].n += 1;
      boxes[index].x += x;
      boxes[index].y += y;
      boxes[index].minX = Math.min(boxes[index].minX, x);
      boxes[index].maxX = Math.max(boxes[index].maxX, x);
    }
  }
  const present = boxes
    .map((box, index) => ({ index, y: box.n ? box.y / box.n : 0, x: box.n ? box.x / box.n : 0, minX: box.minX, maxX: box.maxX, n: box.n }))
    .filter((box) => box.n > 12);
  const lines: typeof present[] = [];
  for (const box of present.sort((a, b) => a.y - b.y)) {
    const line = lines.find((group) => Math.abs(group[0].y - box.y) < Math.max(14, fontSize * 0.45));
    if (line) line.push(box);
    else lines.push([box]);
  }
  return { chunks, lines };
}

function decodePng(buf: Buffer) {
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat: Buffer[] = [];
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    offset += 12 + length;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = colorType === 6 ? 4 : 3;
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  const previous = Buffer.alloc(stride);
  let source = 0;
  let dest = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[source++];
    const row = raw.subarray(source, source + stride);
    source += stride;
    const current = Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const left = i >= bpp ? current[i - bpp] : 0;
      const up = previous[i];
      const upLeft = i >= bpp ? previous[i - bpp] : 0;
      let value = row[i];
      if (filter === 1) value = (value + left) & 255;
      else if (filter === 2) value = (value + up) & 255;
      else if (filter === 3) value = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const estimate = left + up - upLeft;
        const distanceLeft = Math.abs(estimate - left);
        const distanceUp = Math.abs(estimate - up);
        const distanceUpLeft = Math.abs(estimate - upLeft);
        const predictor = distanceLeft <= distanceUp && distanceLeft <= distanceUpLeft ? left : distanceUp <= distanceUpLeft ? up : upLeft;
        value = (value + predictor) & 255;
      }
      current[i] = value;
    }
    current.copy(out, dest);
    current.copy(previous);
    dest += stride;
  }
  return { width, height, data: out, bpp };
}
