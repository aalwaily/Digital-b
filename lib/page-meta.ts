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
}): Metadata {
  const locale = input.locale ?? "en";
  const canonical = localePath(locale, input.path);
  const image = `${canonical}/opengraph-image`;
  const images = input.index === false ? undefined : [{ url: image, width: 1200, height: 630, alt: input.title }];
  const languages = definedLanguages(
    input.languages ?? {
      en: localePath("en", input.path),
      ar: localePath("ar", input.path),
      "x-default": localePath("en", input.path),
    },
  );
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical, languages },
    robots: input.index === false ? { index: false, follow: false } : undefined,
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      locale: locale === "ar" ? "ar_SA" : "en_US",
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
