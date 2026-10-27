import { arabicCategorySeo, categorySeo } from "@/data/page-seo";
import { getCategory } from "@/data/products";
import { stripBidiIsolates } from "@/lib/i18n/bidi";
import { localizeCategory } from "@/lib/i18n/content";
import { isLocale } from "@/lib/i18n/config";
import { renderOgImage } from "@/lib/og-image";
import { notFound } from "next/navigation";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press PDF guides";

export default async function Image({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale: raw, category } = await params;
  const locale = isLocale(raw) ? raw : "en";
  if (!getCategory(category)) notFound();
  const seo = (locale === "ar" ? arabicCategorySeo : categorySeo)[category];
  const localized = localizeCategory(category, locale);
  return renderOgImage({
    title: stripBidiIsolates(localized?.name ?? "Vellum Press"),
    deck: seo?.description ?? "",
  });
}
