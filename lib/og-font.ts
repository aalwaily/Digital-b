import { readFileSync } from "node:fs";
import path from "node:path";
import opentype from "@shuding/opentype.js";

/** Family name stored in the vendored TTF name table. Must match `fontFamily`. */
export const OG_ARABIC_FONT_FAMILY = "IBM Plex Sans Arabic";

const FONT_PATH = path.join(process.cwd(), "assets/fonts/IBMPlexSansArabic-Regular.ttf");

const ARABIC =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

let cached: Buffer | undefined;
let parsed: ReturnType<typeof opentype.parse> | undefined;

export function ogContainsArabic(text: string) {
  return ARABIC.test(text);
}

export function ogArabicFontData() {
  cached ??= readFileSync(FONT_PATH);
  return cached;
}

/**
 * Width of a whole shaped run. Satori adds up each grapheme measured alone,
 * and those isolated Arabic letters are much wider than the connected word
 * it actually paints. The flex row uses this width so the empty advance
 * does not show up as a stretched gap.
 */
export function ogArabicTextWidth(text: string, fontSize: number) {
  if (!text) return 0;
  if (!parsed) {
    const data = ogArabicFontData();
    const bytes = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    parsed = opentype.parse(bytes as ArrayBuffer);
  }
  return Math.ceil(parsed.getAdvanceWidth(text, fontSize));
}

/**
 * A static TTF Satori can shape. The on-demand Google Noto Sans Arabic subset
 * uses GSUB lookup type 5, which this Satori build throws on.
 * A copy is returned so concurrent renders cannot detach the cached bytes.
 */
export function ogArabicFonts() {
  return [
    {
      name: OG_ARABIC_FONT_FAMILY,
      data: Buffer.from(ogArabicFontData()),
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}
