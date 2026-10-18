import { renderOgImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Shop Vellum Press PDF guides";

export default function Image() {
  return renderOgImage({
    title: "Shop the guides",
    deck: "Eight PDFs and two bundles · Pay once",
  });
}
