import { site } from "@/data/site";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";

function definedLanguages(languages: Partial<Record<string, string | undefined>>) {
  return Object.fromEntries(Object.entries(languages).filter((entry): entry is [string, string] => Boolean(entry[1])));
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  absoluteTitle?: boolean;
  index?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  languages?: Partial<Record<"en" | "ar" | "x-default", string>>;
  /** 404 responses should not declare a canonical. */
  canonical?: boolean;
}): Metadata {
  const locale = input.locale ?? "en";
  const indexable = input.index !== false;
  const canonical = localePath(locale, input.path);
  const image = `${canonical}/opengraph-image`;
  const images = indexable ? [{ url: image, width: 1200, height: 630, alt: input.title }] : undefined;
  // noindex URLs must not be hreflang targets. Omit alternates entirely.
  const languages = indexable
    ? definedLanguages(
        input.languages ?? {
          en: localePath("en", input.path),
          ar: localePath("ar", input.path),
          "x-default": localePath("en", input.path),
        },
      )
    : undefined;
  const hasPair = Boolean(languages?.en && languages?.ar);
  const declareCanonical = input.canonical !== false;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: {
      ...(declareCanonical ? { canonical } : {}),
      ...(languages && Object.keys(languages).length > 0 ? { languages } : {}),
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: input.title,
      description: input.description,
      ...(declareCanonical ? { url: canonical } : {}),
      siteName: site.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      ...(hasPair ? { alternateLocale: locale === "ar" ? "en_US" : "ar_SA" } : {}),
      type: input.type ?? "website",
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      ...(images ? { images: [image] } : {}),
    },
  };
}
