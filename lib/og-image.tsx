import { ImageResponse } from "next/og";
import { OG_ARABIC_FONT_FAMILY, ogArabicFonts, ogContainsArabic } from "@/lib/og-font";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function renderOgImage({
  eyebrow = "VELLUM PRESS",
  title,
  deck,
}: {
  eyebrow?: string;
  title: string;
  deck: string;
}) {
  const titleSize = title.length > 48 ? 52 : title.length > 32 ? 60 : 72;
  if (!ogContainsArabic(`${eyebrow}\n${title}\n${deck}`)) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "#1E3A32",
            color: "#F3EDE2",
            padding: 72,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", direction: "ltr", unicodeBidi: "isolate", letterSpacing: 6, fontSize: 22, color: "#E4B15A" }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: titleSize, lineHeight: 1.05, maxWidth: 980 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 28, opacity: 0.9 }}>{deck}</div>
        </div>
      ),
      ogSize,
    );
  }

  // Satori shapes Arabic and runs the bidi algorithm itself. CSS direction:rtl
  // would reverse those runs a second time. Letter-spacing breaks joining.
  const eyebrowTracking = ogContainsArabic(eyebrow) ? 0 : 6;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#1E3A32",
          color: "#F3EDE2",
          padding: 72,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontFamily: OG_ARABIC_FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", letterSpacing: eyebrowTracking, fontSize: 22, color: "#E4B15A" }}>{eyebrow}</div>
        <div style={{ display: "flex", width: "100%", justifyContent: "flex-end", fontSize: titleSize, lineHeight: 1.15, textAlign: "right" }}>
          {title}
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: "flex-end", fontSize: 28, lineHeight: 1.35, opacity: 0.9, textAlign: "right" }}>
          {deck}
        </div>
      </div>
    ),
    { ...ogSize, fonts: ogArabicFonts() },
  );
}
