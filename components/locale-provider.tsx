"use client";

import { getDictionary, type Dictionary } from "@/lib/i18n/dictionary";
import { localeCookieValue, localePath, stripLocale, type Locale } from "@/lib/i18n/config";
import { languageAlternate } from "@/lib/locale-path";
import { usePathname } from "next/navigation";
import { createContext, useContext, useLayoutEffect, useMemo } from "react";

type LocaleValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: Dictionary;
  href: (path: string) => string;
  switchTo: (locale: Locale) => void;
  alternateHref: string;
};

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const value = useMemo<LocaleValue>(() => {
    const bare = stripLocale(pathname);
    const alternate = languageAlternate(pathname);
    return {
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      t: getDictionary(locale),
      href: (path: string) => localePath(locale, path),
      alternateHref: alternate.href,
      switchTo: (next: Locale) => {
        const secure = window.location.protocol === "https:";
        const query = window.location.search;
        document.cookie = localeCookieValue(next, secure);
        const target = languageAlternate(pathname);
        const href = target.lang === next ? target.href : localePath(next, bare);
        window.location.assign(`${href}${query}`);
      },
    };
  }, [locale, pathname]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = locale === "ar" ? "ar" : "en";
    root.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useI18n must be used inside LocaleProvider");
  }
  return value;
}
