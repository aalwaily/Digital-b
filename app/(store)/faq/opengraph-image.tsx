import { renderOgImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press frequently asked questions";

export default function Image() {
  return renderOgImage({
    title: "Frequently asked questions",
    deck: "Delivery, all sales final, and PayPal checkout",
  });
}
