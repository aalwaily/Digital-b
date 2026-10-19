import { readFileSync } from "node:fs";
import path from "node:path";

/** Family name stored in the vendored TTF name table. Must match `fontFamily`. */
export const OG_ARABIC_FONT_FAMILY = "IBM Plex Sans Arabic";

const FONT_PATH = path.join(process.cwd(), "assets/fonts/IBMPlexSansArabic-Regular.ttf");

const ARABIC =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

let cached: Buffer | undefined;

export function ogContainsArabic(text: string) {
  return ARABIC.test(text);
}

export function ogArabicFontData() {
  cached ??= readFileSync(FONT_PATH);
  return cached;
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
