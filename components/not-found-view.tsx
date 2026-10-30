import { site } from "@/data/site";
import { localizedCategories } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import Link from "next/link";

export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const home = `/${locale}`;
  const shop = `/${locale}/shop`;
  const contact = `/${locale}/contact`;
  const categories = localizedCategories(locale);

  return (
    <div className="mx-auto w-full min-w-0 max-w-xl break-words px-4 py-12 text-center sm:px-5 sm:py-16">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">{t.notFound.eyebrow}</p>
      <h1 className="mt-3 text-balance font-serif text-3xl leading-tight sm:text-5xl">{t.notFound.title}</h1>
      <p className="mt-4 text-pretty text-muted-foreground">{t.notFound.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={home} data-primary-cta="" className="inline-flex h-11 max-w-full items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground">
          {t.notFound.home}
        </Link>
        <Link href={shop} className="inline-flex h-11 max-w-full items-center rounded-lg border px-5 text-sm font-medium">
          {t.footer.allGuides}
        </Link>
      </div>

      <section className="mt-10 text-start" aria-labelledby="not-found-categories">
        <h2 id="not-found-categories" className="font-serif text-xl">
          {t.notFound.categories}
        </h2>
        <ul className="fab-clear mt-3 overflow-hidden rounded-xl border">
          <li className="border-b">
            <Link href={shop} className="block min-h-11 break-words px-3 py-2.5 text-sm hover:bg-muted">
              {t.footer.allGuides}
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.slug} className="border-b last:border-b-0">
              <Link
                href={`/${locale}/shop/${category.slug}`}
                className="block min-h-11 break-words px-3 py-2.5 text-sm hover:bg-muted"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 text-start" aria-labelledby="not-found-contact">
        <h2 id="not-found-contact" className="font-serif text-xl">
          {t.notFound.contact}
        </h2>
        <ul className="fab-clear mt-3 overflow-hidden rounded-xl border">
          <li className="border-b">
            <Link href={contact} className="block min-h-11 break-words px-3 py-2.5 text-sm hover:bg-muted">
              {t.nav.contact}
            </Link>
          </li>
          <li>
            <a
              dir="ltr"
              href={`mailto:${site.email}`}
              className="block min-h-11 min-w-0 break-all px-3 py-2.5 text-sm hover:bg-muted"
            >
              {site.email}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
