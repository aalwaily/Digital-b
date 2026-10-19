import { renderOgImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "About Vellum Press";

export default function Image() {
  return renderOgImage({
    title: "Guides worth keeping.",
    deck: "Pay once · Payments processed by PayPal",
  });
}
