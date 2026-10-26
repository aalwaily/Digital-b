import type { Locale } from "@/lib/i18n/config";

/**
 * Slug, language, and translation pairs for journal routes.
 * Kept separate from article bodies so the language switcher can resolve a
 * real URL without shipping every essay to the browser.
 * tests/routes.test.ts fails if this drifts from data/blog.ts.
 */
export type BlogRoute = {
  slug: string;
  lang?: Locale;
  translationOf?: string;
};

export const blogIndex: readonly BlogRoute[] = [
  { slug: "sunday-prep-that-holds" },
  { slug: "one-evening-budget-reset" },
  { slug: "stop-rereading-your-notes" },
  { slug: "side-hustle-beside-a-job" },
  { slug: "freelance-budget-template-irregular-income", lang: "en" },
  { slug: "ats-cv-template-saudi-jobs", lang: "en", translationOf: "qalb-sira-ats" },
  { slug: "freelance-document-saudi-arabia", lang: "en", translationOf: "wathiqat-al-amal-al-hur" },
  { slug: "fat-loss-meal-plan-pdf", lang: "en", translationOf: "khitat-nuzul-al-wazn" },
  { slug: "monthly-budget-planner-pdf", lang: "en", translationOf: "jadwal-mizaniya-shahriya" },
  { slug: "qalb-sira-ats", lang: "ar", translationOf: "ats-cv-template-saudi-jobs" },
  { slug: "wathiqat-al-amal-al-hur", lang: "ar", translationOf: "freelance-document-saudi-arabia" },
  { slug: "jadwal-mizaniya-shahriya", lang: "ar", translationOf: "monthly-budget-planner-pdf" },
  { slug: "khitat-nuzul-al-wazn", lang: "ar", translationOf: "fat-loss-meal-plan-pdf" },
];

export function blogRoute(slug: string) {
  return blogIndex.find((entry) => entry.slug === slug);
}

export function blogLocalesForSlug(slug: string): Locale[] {
  const entry = blogRoute(slug);
  if (!entry) return [];
  if (entry.lang === "ar") return ["ar"];
  if (entry.lang === "en") return ["en"];
  return ["en", "ar"];
}

export function blogPath(slug: string, locale: Locale) {
  return `/${locale}/blog/${slug}`;
}

/** hreflang set for one journal slug. Omits a language the article does not have. */
export function blogHreflang(slug: string): Partial<Record<Locale | "x-default", string>> | null {
  const entry = blogRoute(slug);
  if (!entry) return null;
  if (entry.translationOf) {
    const other = blogRoute(entry.translationOf);
    if (other) {
      const enSlug = entry.lang === "ar" ? other.slug : entry.slug;
      const arSlug = entry.lang === "ar" ? entry.slug : other.slug;
      const en = blogPath(enSlug, "en");
      const ar = blogPath(arSlug, "ar");
      return { en, ar, "x-default": en };
    }
  }
  const locales = blogLocalesForSlug(slug);
  if (locales.length === 2) {
    const en = blogPath(slug, "en");
    const ar = blogPath(slug, "ar");
    return { en, ar, "x-default": en };
  }
  if (locales[0] === "ar") {
    const self = blogPath(slug, "ar");
    return { ar: self, "x-default": self };
  }
  const self = blogPath(slug, "en");
  return { en: self, "x-default": self };
}
