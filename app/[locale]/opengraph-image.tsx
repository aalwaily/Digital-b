import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/config";
import { renderOgImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press, practical PDF guides";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const raw = (await params).locale;
  const locale = isLocale(raw) ? raw : "en";
  const t = getDictionary(locale);
  return renderOgImage({
    title: t.home.title,
    deck: t.home.lede,
  });
}
