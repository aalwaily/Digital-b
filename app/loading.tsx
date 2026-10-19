import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, LOCALE_HEADER } from "@/lib/i18n/config";
import { headers } from "next/headers";

export default async function Loading() {
  const requested = (await headers()).get(LOCALE_HEADER);
  const locale = isLocale(requested) ? requested : "en";
  const t = getDictionary(locale);
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-sm text-muted-foreground">{t.loading}</p>
    </div>
  );
}
