import { ContactForm } from "@/components/contact-form";
import { site } from "@/data/site";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  return pageMetadata({
    title: t.contact.metaTitle,
    description: t.contact.metaDescription(site.name, site.email),
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);

  return (
    <div className="mx-auto grid min-w-0 max-w-6xl gap-12 px-5 py-12 md:grid-cols-2">
      <div className="min-w-0">
        <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.contact.eyebrow}</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{t.contact.title}</h1>
        <p className="mt-4 text-muted-foreground">{t.contact.lede(t.contact.response)}</p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">{t.contact.orders}</dt>
            <dd>
              <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={`mailto:${site.supportEmail}`}>
                {site.supportEmail}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t.contact.else}</dt>
            <dd>
              <a dir="ltr" className="inline-flex min-h-11 items-center underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t.contact.where}</dt>
            <dd>{locale === "ar" ? "الدمام، المملكة العربية السعودية" : site.location}</dd>
          </div>
        </dl>
      </div>
      <div className="min-w-0 rounded-2xl border bg-card p-5 md:p-6">
        <ContactForm />
      </div>
    </div>
  );
}
