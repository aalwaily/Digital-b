import { site } from "@/data/site";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  return pageMetadata({
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    path: "/about",
    locale,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.about.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{t.about.title}</h1>
      <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed">
        {t.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h2 className="mt-12 font-serif text-3xl">{t.about.how}</h2>
      <ol className="mt-4 space-y-3 text-sm leading-relaxed">
        {t.about.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <h2 className="mt-12 font-serif text-3xl">{t.about.details}</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">{t.about.name}</dt>
          <dd>{site.legalName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t.about.location}</dt>
          <dd>{t.about.locationValue}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t.about.email}</dt>
          <dd>
            <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t.about.support}</dt>
          <dd>
            <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>
          </dd>
        </div>
      </dl>
      <p className="mt-6 rounded-xl border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        {t.about.note(site.email, t.about.locationValue, site.legalName)}
      </p>
      <p className="mt-8">
        <Link href={localePath(locale, "/shop")} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">
          {t.about.browse}
        </Link>
      </p>
    </div>
  );
}
