import { FaqList } from "@/components/faq-list";
import { JsonLdList } from "@/components/json-ld";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizeFaqs, requireLocale } from "@/lib/i18n/content";
import { pageJsonLd } from "@/lib/page-jsonld";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  return pageMetadata(publicMetadata(locale, "/faq")!);
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const items = localizeFaqs(locale);

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-5 py-12">
      <JsonLdList data={pageJsonLd(locale, "/faq")} />
      <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.faq.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{t.faq.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.faq.lede}</p>
      <div className="mt-8">
        <FaqList items={items} />
      </div>
    </div>
  );
}
