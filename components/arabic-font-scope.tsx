import { FontPreloads } from "@/components/font-preloads";
import { preloadArabicFaces } from "@/lib/font-preload";
import { IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic } from "next/font/google";
import type { ReactNode } from "react";

// Weights stay at the ones the UI actually uses (body 400, medium 500, headings 500).
const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500"],
  variable: "--font-arabic-sans",
  display: "swap",
  // next/font preloads are global. Keep these off so English pages do not
  // download Arabic files. Arabic pages discover them from the inlined CSS.
  preload: false,
  adjustFontFallback: true,
});

const arabicSerif = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["500"],
  variable: "--font-arabic-serif",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export function ArabicFontScope({ children }: { children: ReactNode }) {
  return (
    <div className={`${arabicSans.variable} ${arabicSerif.variable} arabic-root`}>
      <FontPreloads pick={preloadArabicFaces} />
      {children}
    </div>
  );
}
