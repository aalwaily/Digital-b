"use client";

import { getDictionary } from "@/lib/i18n/dictionary";
import { localeFromPath } from "@/lib/i18n/config";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LocaleNotFound() {
  const pathname = usePathname() || "/en";
  const locale = localeFromPath(pathname) ?? "en";
  const t = getDictionary(locale);
  const home = locale === "ar" ? "/ar" : "/en";
  const shop = locale === "ar" ? "/ar/shop" : "/en/shop";

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">{t.notFound.eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{t.notFound.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.notFound.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={home} className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground">
          {t.notFound.home}
        </Link>
        <Link
          href={shop}
          className="inline-flex h-11 items-center rounded-lg border px-5 text-sm font-medium"
        >
          {t.notFound.shop}
        </Link>
      </div>
    </div>
  );
}
