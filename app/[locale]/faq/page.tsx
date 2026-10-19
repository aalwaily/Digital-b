import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizeFaqs, requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import { staticSeo } from "@/data/page-seo";
import { faqSchema } from "@/lib/schema";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const seo = staticSeo.faq;
  return pageMetadata({
    title: locale === "ar" ? t.faq.metaTitle : seo.title,
    description: locale === "ar" ? t.faq.metaDescription : seo.description,
    path: "/faq",
    locale,
    absoluteTitle: locale === "en",
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const items = localizeFaqs(locale);

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-5 py-12">
      <JsonLd data={faqSchema(items)} />
      <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.faq.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{t.faq.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.faq.lede}</p>
      <div className="mt-8">
        <FaqList items={items} />
      </div>
    </div>
  );
}
