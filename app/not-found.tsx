import { NotFoundView } from "@/components/not-found-view";
import { SkipLink } from "@/components/skip-link";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, LOCALE_HEADER, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

async function requestLocale(): Promise<Locale> {
  const requested = (await headers()).get(LOCALE_HEADER);
  return isLocale(requested) ? requested : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return pageMetadata(publicMetadata(locale, "/404")!);
}

export default async function NotFound() {
  const locale = await requestLocale();
  const t = getDictionary(locale);
  const other: Locale = locale === "ar" ? "en" : "ar";
  const page = (
    <div className="overflow-x-clip">
      <SkipLink label={t.skip} />
      <header className="border-b bg-background pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-1 gap-y-1 px-3 py-1">
          <Link
            href={`/${locale}`}
            dir="ltr"
            className="inline-flex h-11 min-w-0 max-w-full items-center font-serif text-lg whitespace-nowrap"
          >
            Vellum <span className="text-copper"> Press</span>
          </Link>
          <a
            href={`/${other}`}
            hrefLang={other}
            lang={other}
            aria-label={`${t.switchTo}, ${t.switchToLabel}`}
            className="ms-auto inline-flex h-11 shrink-0 items-center justify-center rounded-lg px-2 text-sm font-medium whitespace-nowrap hover:bg-muted"
          >
            {t.switchTo}
          </a>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg px-3 text-sm font-medium whitespace-nowrap hover:bg-muted"
          >
            {t.notFound.shop}
          </Link>
        </div>
      </header>
      <main id="main" className="pb-28">
        <NotFoundView locale={locale} />
      </main>
      <WhatsAppButton label={t.whatsapp.label} dir={locale === "ar" ? "rtl" : "ltr"} />
    </div>
  );

  if (locale === "ar") {
    const { ArabicFontScope } = await import("@/components/arabic-font-scope");
    return <ArabicFontScope>{page}</ArabicFontScope>;
  }
  return page;
}
