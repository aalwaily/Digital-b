import { getProduct } from "@/data/products";
import { localizedProduct } from "@/lib/i18n/content";
import { isLocale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/money";
import { OG_ARABIC_FONT_FAMILY, ogArabicFonts, ogContainsArabic } from "@/lib/og-font";
import { OgRtlText } from "@/lib/og-rtl";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press guide";

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  if (!getProduct(slug)) notFound();
  const product = localizedProduct(slug, locale);
  const bg = product?.cover.bg ?? "#1E3A32";
  const fg = product?.cover.fg ?? "#F6F1E7";
  const accent = product?.cover.accent ?? "#E4B15A";
  const title = product?.title ?? "Vellum Press";
  const deck = product?.subtitle ?? "Practical PDF guides";
  const price = product ? formatMoney(product.price) : "";
  const download = locale === "ar" ? "تنزيل فوري" : "Instant download";
  const arabic = ogContainsArabic(`${title}\n${deck}\n${download}`);

  if (!arabic) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", background: bg, color: fg }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%" }}>
            <div style={{ display: "flex", letterSpacing: 4, fontSize: 22, color: accent }}>VELLUM PRESS</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: title.length > 28 ? 56 : 76, lineHeight: 1.15, maxWidth: 980 }}>{title}</div>
              <div style={{ marginTop: 18, fontSize: 28, opacity: 0.85 }}>{deck}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
              <span>{price} · PDF</span>
              <span style={{ color: accent }}>{download}</span>
            </div>
          </div>
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: bg,
          color: fg,
          fontFamily: OG_ARABIC_FONT_FAMILY,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: 72,
            width: "100%",
          }}
        >
          <div style={{ display: "flex", letterSpacing: 4, fontSize: 22, color: accent }}>VELLUM PRESS</div>
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <OgRtlText text={title} fontSize={title.length > 28 ? 56 : 76} lineHeight={1.15} />
            <div style={{ display: "flex", marginTop: 18, width: "100%" }}>
              <OgRtlText text={deck} fontSize={28} lineHeight={1.35} opacity={0.85} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row-reverse", alignItems: "center", width: "100%", fontSize: 28 }}>
            <div style={{ display: "flex", direction: "ltr", unicodeBidi: "isolate" }}>{`${price} · PDF`}</div>
            <OgRtlText text={download} fontSize={28} color={accent} block={false} />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogArabicFonts() },
  );
}
