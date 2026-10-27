import { legalPages } from "@/data/legal";
import { formatLongDate, localizedLegal, requireLocale } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { locale: string; slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const t = getDictionary(locale);
  const meta = publicMetadata(locale, `/legal/${slug}`);
  if (!meta) return { title: t.legal.metaFallback };
  return pageMetadata(meta);
}

export default async function LegalPage({ params }: { params: Promise<Params> }) {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const t = getDictionary(locale);
  const page = localizedLegal(slug, locale);
  if (!page) notFound();

  return (
    <article className="mx-auto min-w-0 max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.legal.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{page.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t.legal.updated(formatLongDate(page.updated, locale))}</p>
      <div className="mt-8 space-y-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-2xl">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-[1.02rem] leading-relaxed">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
