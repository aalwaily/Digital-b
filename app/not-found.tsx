import { getDictionary, type Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import Link from "next/link";

function NotFoundBody({ locale, t }: { locale: Locale; t: Dictionary }) {
  const home = `/${locale}`;
  const shop = `/${locale}/shop`;
  const other: Locale = locale === "ar" ? "en" : "ar";
  return (
    <>
      <header className="border-b bg-background pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-1 px-3">
          <Link href={home} dir="ltr" className="inline-flex h-11 min-w-0 items-center font-serif text-lg">
            Vellum <span className="text-copper"> Press</span>
          </Link>
          <a
            href={`/${other}`}
            hrefLang={other}
            lang={other}
            className="ms-auto inline-flex h-11 min-w-11 items-center justify-center rounded-lg px-2 text-sm font-medium hover:bg-muted"
          >
            {locale === "ar" ? "English" : "العربية"}
          </a>
          <Link href={shop} className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg px-3 text-sm font-medium hover:bg-muted">
            {t.notFound.shop}
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-xs tracking-[0.18em] text-copper uppercase">{t.notFound.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{t.notFound.title}</h1>
        <p className="mt-4 text-muted-foreground">{t.notFound.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={home} className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground">
            {t.notFound.home}
          </Link>
          <Link href={shop} className="inline-flex h-11 items-center rounded-lg border px-5 text-sm font-medium">
            {t.notFound.shop}
          </Link>
        </div>
      </div>
    </>
  );
}

export default function NotFound() {
  return (
    <>
      <style>{`.nf-ar{display:none}html[dir="rtl"] .nf-en{display:none}html[dir="rtl"] .nf-ar{display:block}`}</style>
      <div className="nf-en">
        <NotFoundBody locale="en" t={getDictionary("en")} />
      </div>
      <div className="nf-ar" lang="ar" dir="rtl">
        <NotFoundBody locale="ar" t={getDictionary("ar")} />
      </div>
    </>
  );
}
