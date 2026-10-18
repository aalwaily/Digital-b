import { getLegalPage } from "@/data/legal";
import { renderOgImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press legal page";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  return renderOgImage({
    eyebrow: "LEGAL",
    title: page?.title ?? "Vellum Press",
    deck: "Payments are processed by PayPal",
  });
}
