import { localizedLegal } from "@/lib/i18n/content";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { renderOgImage } from "@/lib/og-image";
import { notFound } from "next/navigation";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press legal page";

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const t = getDictionary(locale);
  const page = localizedLegal(slug, locale);
  if (!page) notFound();
  return renderOgImage({
    eyebrow: locale === "ar" ? "قانوني" : "LEGAL",
    title: page?.title ?? t.legal.metaFallback,
    deck: page?.description ?? t.about.metaDescription,
  });
}
