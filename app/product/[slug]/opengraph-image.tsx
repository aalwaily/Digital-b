import { getProduct } from "@/data/products";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press guide";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  const bg = product?.cover.bg ?? "#1E3A32";
  const fg = product?.cover.fg ?? "#F6F1E7";
  const accent = product?.cover.accent ?? "#E4B15A";
  const title = product?.title ?? "Vellum Press";
  const deck = product?.subtitle ?? "Practical PDF guides";
  const price = product ? `$${product.price}` : "";

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: bg, color: fg }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%" }}>
          <div style={{ display: "flex", letterSpacing: 6, fontSize: 22, color: accent }}>VELLUM PRESS</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}>{title}</div>
            <div style={{ marginTop: 18, fontSize: 28, opacity: 0.85 }}>{deck}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
            <span>{price} · PDF</span>
            <span style={{ color: accent }}>Instant download</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
