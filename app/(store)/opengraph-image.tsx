import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press, practical PDF guides";

export default function Image() {
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
        <div style={{ letterSpacing: 6, fontSize: 22, color: "#E4B15A" }}>VELLUM PRESS</div>
        <div style={{ fontSize: 74, lineHeight: 1.05, maxWidth: 900 }}>
          Practical guides for a well-lived life.
        </div>
        <div style={{ fontSize: 28 }}>PDF guides · Pay once · Yours to keep</div>
      </div>
    ),
    size,
  );
}
