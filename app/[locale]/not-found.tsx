import { NotFoundView } from "@/components/not-found-view";
import { isLocale, LOCALE_HEADER, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import type { Metadata } from "next";
import { headers } from "next/headers";

async function requestLocale(): Promise<Locale> {
  const requested = (await headers()).get(LOCALE_HEADER);
  return isLocale(requested) ? requested : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return pageMetadata(publicMetadata(locale, "/404")!);
}

export default async function LocaleNotFound() {
  const locale = await requestLocale();
  return <NotFoundView locale={locale} />;
}
