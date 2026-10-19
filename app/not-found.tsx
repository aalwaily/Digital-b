import { LinkButton } from "@/components/link-button";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, LOCALE_HEADER } from "@/lib/i18n/config";
import { headers } from "next/headers";

export default async function NotFound() {
  const requested = (await headers()).get(LOCALE_HEADER);
  const locale = isLocale(requested) ? requested : "en";
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">{t.notFound.eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{t.notFound.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.notFound.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/" className="h-11 px-5">
          {t.notFound.home}
        </LinkButton>
        <LinkButton href="/shop" variant="outline" className="h-11 px-5">
          {t.notFound.shop}
        </LinkButton>
      </div>
    </div>
  );
}
