import {
  COVER_PAD,
  COVER_RIGHT,
  COVER_WIDTH,
  coverLatinPlacement,
  coverRule,
  coverSvgBidi,
  coverTextPlacement,
  mirrorX,
  worksheetHeadingX,
} from "@/lib/cover-layout";
import { describe, expect, it } from "vitest";

describe("cover layout", () => {
  it("keeps English text on the left inset", () => {
    expect(coverTextPlacement(false)).toEqual({ x: COVER_PAD, textAnchor: "start" });
    expect(coverLatinPlacement(false)).toEqual({ x: COVER_PAD, textAnchor: "start" });
    expect(coverRule(false)).toEqual({ x1: 48, y1: 720, x2: 180, y2: 720 });
    expect(coverSvgBidi(false)).toEqual({});
    expect(worksheetHeadingX(0, false)).toBe(64);
    expect(worksheetHeadingX(2, false)).toBe(404);
    expect(mirrorX(68, 18, false)).toBe(68);
    expect(mirrorX(390, 130, false)).toBe(390);
  });

  it("right-aligns Arabic text inside the card instead of anchoring the left edge", () => {
    expect(coverTextPlacement(true)).toEqual({
      x: COVER_RIGHT,
      textAnchor: "start",
      direction: "rtl",
      unicodeBidi: "isolate",
    });
    expect(coverTextPlacement(true).textAnchor).not.toBe("end");
    expect(coverTextPlacement(true, 500).x).toBe(500);
    expect(coverLatinPlacement(true)).toEqual({
      x: COVER_RIGHT,
      textAnchor: "end",
      direction: "ltr",
      unicodeBidi: "isolate",
    });
    expect(coverRule(true)).toEqual({ x1: COVER_RIGHT - 132, y1: 720, x2: COVER_RIGHT, y2: 720 });
    expect(coverSvgBidi(true).direction).toBe("ltr");
  });

  it("mirrors worksheet columns into the right padding", () => {
    expect(worksheetHeadingX(0, true)).toBe(COVER_WIDTH - 64);
    expect(worksheetHeadingX(1, true)).toBe(COVER_WIDTH - 234);
    expect(mirrorX(68, 18, true)).toBe(COVER_WIDTH - 68 - 18);
    expect(mirrorX(220, 120, true)).toBeGreaterThanOrEqual(COVER_PAD);
    expect(mirrorX(390, 130, true) + 130).toBeLessThanOrEqual(COVER_WIDTH - COVER_PAD);
  });
});
