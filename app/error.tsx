"use client";

import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

function ErrorBody({ locale, reset }: { locale: Locale; reset: () => void }) {
  const t = getDictionary(locale);
  return (
    <div className={locale === "ar" ? "nf-ar" : "nf-en"} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-serif text-4xl">{t.error.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.error.text}</p>
        <button
          type="button"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
          onClick={() => reset()}
        >
          {t.error.retry}
        </button>
      </div>
    </div>
  );
}

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <style>{`.nf-ar{display:none}html[dir="rtl"] .nf-en{display:none}html[dir="rtl"] .nf-ar{display:block}`}</style>
      <ErrorBody locale="en" reset={reset} />
      <ErrorBody locale="ar" reset={reset} />
    </>
  );
}
