import { ImageResponse } from "next/og";
import { OG_ARABIC_FONT_FAMILY, ogArabicFonts, ogContainsArabic } from "@/lib/og-font";
import { OgRtlText } from "@/lib/og-rtl";

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

  const arabicEyebrow = ogContainsArabic(eyebrow);
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
        {arabicEyebrow ? (
          <OgRtlText text={eyebrow} fontSize={22} color="#E4B15A" block={false} />
        ) : (
          <div style={{ display: "flex", letterSpacing: 6, fontSize: 22, color: "#E4B15A" }}>{eyebrow}</div>
        )}
        <OgRtlText text={title} fontSize={titleSize} lineHeight={1.15} />
        <OgRtlText text={deck} fontSize={28} lineHeight={1.35} opacity={0.9} />
      </div>
    ),
    { ...ogSize, fonts: ogArabicFonts() },
  );
}
