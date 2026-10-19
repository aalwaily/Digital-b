import { renderOgImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The Vellum Press journal";

export default function Image() {
  return renderOgImage({
    title: "Notes from the desk",
    deck: "Meal prep, money, study, and work",
  });
}
