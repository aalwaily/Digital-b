import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

let cssCache: string | null = null;

function fontCss() {
  if (cssCache !== null) return cssCache;
  try {
    const dir = path.join(process.cwd(), ".next/static/css");
    cssCache = readdirSync(dir)
      .filter((file) => file.endsWith(".css"))
      .map((file) => readFileSync(path.join(dir, file), "utf8"))
      .join("\n");
  } catch {
    cssCache = "";
  }
  return cssCache;
}

/** URLs for the @font-face rules a page should preload. Empty when CSS is not built yet. */
export function fontHrefs(pick: (face: string) => boolean) {
  const found: { href: string; face: string }[] = [];
  const seen = new Set<string>();
  for (const face of fontCss().match(/@font-face\{[^}]+\}/g) ?? []) {
    if (!pick(face)) continue;
    const src = face.match(/url\((\/_next\/static\/media\/[^)]+\.woff2)\)/);
    if (!src || seen.has(src[1])) continue;
    seen.add(src[1]);
    found.push({ href: src[1], face });
  }
  return found;
}

export function preloadLatinFaces(face: string) {
  return /font-family:(?:Outfit|Fraunces);/.test(face) && face.includes("u+00");
}

export function preloadArabicFaces(face: string) {
  // Arabic sentences also need the basic-latin file (spaces, digits, periods).
  // Preload that subset with the Arabic-script subset so LCP text is not a
  // second round trip. Skip IBM weight 500: it is only medium-weight chrome.
  // Match the primary subset only. `u+0001` is a separate control-character file.
  const lcpRange = /unicode-range:u\+(?:00|06)\?\?/.test(face);
  if (!lcpRange) return false;
  if (/font-family:Noto Naskh Arabic/.test(face)) return true;
  return /font-family:IBM Plex Sans Arabic/.test(face) && /font-weight:400/.test(face);
}
