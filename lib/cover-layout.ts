/** Cover art is a 600×800 SVG. Text uses physical coordinates. */

export const COVER_WIDTH = 600;
export const COVER_PAD = 48;
export const COVER_RIGHT = COVER_WIDTH - COVER_PAD;

export type CoverTextAttrs = {
  x: number;
  textAnchor: "start" | "end";
  direction?: "ltr" | "rtl";
  unicodeBidi?: "isolate";
};

/**
 * Arabic pages set dir=rtl on the document. SVG text inherits that direction.
 * With direction:rtl, text-anchor "end" is the left edge, so an x on the right
 * inset paints the line out through the right side of the viewBox.
 * text-anchor "start" plus an explicit rtl direction keeps the right edge on
 * the inset and lets the line grow left, inside the card.
 */
export function coverTextPlacement(rtl: boolean, x?: number): CoverTextAttrs {
  if (!rtl) return { x: x ?? COVER_PAD, textAnchor: "start" };
  return {
    x: x ?? COVER_RIGHT,
    textAnchor: "start",
    direction: "rtl",
    unicodeBidi: "isolate",
  };
}

/** Latin runs (the wordmark, index numbers) stay left-to-right, but sit on the right inset in Arabic. */
export function coverLatinPlacement(rtl: boolean, x?: number): CoverTextAttrs {
  if (!rtl) return { x: x ?? COVER_PAD, textAnchor: "start" };
  return {
    x: x ?? COVER_RIGHT,
    textAnchor: "end",
    direction: "ltr",
    unicodeBidi: "isolate",
  };
}

/** Stop the page's dir=rtl from inheriting into the SVG coordinate system. */
export function coverSvgBidi(rtl: boolean): {
  direction?: "ltr";
  unicodeBidi?: "isolate";
  style?: { direction: "ltr"; unicodeBidi: "isolate" };
} {
  if (!rtl) return {};
  return {
    direction: "ltr",
    unicodeBidi: "isolate",
    style: { direction: "ltr", unicodeBidi: "isolate" },
  };
}

export function coverRule(rtl: boolean) {
  return rtl ? { x1: COVER_RIGHT - 132, y1: 720, x2: COVER_RIGHT, y2: 720 } : { x1: COVER_PAD, y1: 720, x2: 180, y2: 720 };
}

/** Mirror a physical x so the English layout stays put and the Arabic layout flips. */
export function mirrorX(x: number, width: number, rtl: boolean) {
  return rtl ? COVER_WIDTH - x - width : x;
}

export function worksheetHeadingX(index: number, rtl: boolean) {
  const ltr = 64 + index * 170;
  return rtl ? COVER_WIDTH - ltr : ltr;
}
