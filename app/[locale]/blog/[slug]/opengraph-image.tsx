import { blogLocalesForSlug } from "@/lib/blog-index";
import { localizedPost } from "@/lib/i18n/content";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { renderOgImage } from "@/lib/og-image";
import { notFound } from "next/navigation";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press journal article";

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  if (!blogLocalesForSlug(slug).includes(locale)) notFound();
  const t = getDictionary(locale);
  const post = localizedPost(slug, locale);
  if (!post) notFound();
  return renderOgImage({
    eyebrow: locale === "ar" ? "المدونة" : "JOURNAL",
    title: post?.title ?? t.blog.title,
    deck: post?.description ?? t.blog.lede,
  });
}
