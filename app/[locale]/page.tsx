import { Cover } from "@/components/cover";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { LinkButton } from "@/components/link-button";
import { products } from "@/data/products";
import { pageCountFor } from "@/lib/catalog";
import { textDir } from "@/lib/i18n/bidi";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/config";
import { localizeFaqs, localizedCategories, localizedProduct, postsForLocale, requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import { staticSeo } from "@/data/page-seo";
import { faqSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import { formatMoney } from "@/lib/money";
import type { Metadata } from "next";
import { Download, LockKeyhole, Printer, ShieldCheck } from "lucide-react";
import Link from "next/link";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const seo = locale === "ar" ? staticSeo.arabicHome : staticSeo.home;
  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/",
    locale,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const bundle = localizedProduct("health-fitness-bundle", locale);
  const heroCovers = ["12-week-reset", "the-quiet-budget", "first-client"]
    .map((slug) => localizedProduct(slug, locale))
    .filter((product) => product !== undefined);
  const featured = products
    .filter((product) => product.featured && product.kind === "guide")
    .slice(0, 4)
    .map((product) => localizedProduct(product.slug, locale))
    .filter((product) => product !== undefined);
  const icons = [Download, LockKeyhole, Printer, ShieldCheck];
  const savings = bundle?.compareAtPrice ? formatMoney(bundle.compareAtPrice - bundle.price) : "";
  const homeFaqs = localizeFaqs(locale).slice(0, 5);

  return (
    <div className="min-w-0">
      <JsonLd data={websiteSchema(CANONICAL_ORIGIN, locale)} />
      <JsonLd data={organizationSchema(CANONICAL_ORIGIN)} />
      <JsonLd data={faqSchema(homeFaqs)} />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:grid-cols-12 md:py-20">
        <div className="min-w-0 md:col-span-6">
          <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.22em]">{t.home.eyebrow}</p>
          <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.12] sm:text-5xl md:text-6xl md:leading-[1.05]">
            {t.home.title}
          </h1>
          <div className="rise">
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">{t.home.lede}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/shop" className="h-11 px-5">
                {t.home.shop}
              </LinkButton>
              <LinkButton href="/product/12-week-reset" variant="outline" className="h-11 px-5">
                {t.home.preview}
              </LinkButton>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">{t.home.guides}</dt>
                <dd dir="ltr" className="font-serif text-2xl">{products.filter((product) => product.kind === "guide").length}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t.home.delivery}</dt>
                <dd className="font-serif text-2xl">{t.home.instant}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t.home.format}</dt>
                <dd dir="ltr" className="font-serif text-2xl">PDF</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="min-w-0 md:col-span-6">
          <div className="mx-auto w-full max-w-[15rem] md:hidden">
            {heroCovers[0] ? (
              <Link href={localePath(locale, `/product/${heroCovers[0].slug}`)}>
                <Cover product={heroCovers[0]} decorative className="rounded-md shadow-lg" />
                <span className="sr-only">{heroCovers[0].title}</span>
              </Link>
            ) : null}
          </div>
          <div className="relative hidden h-[540px] overflow-hidden md:block">
            {heroCovers[2] ? (
              <Link href={localePath(locale, "/product/first-client")} className="absolute top-6 end-2 z-10 w-52 rotate-3">
                <Cover product={heroCovers[2]} decorative />
                <span className="sr-only">{heroCovers[2].title}</span>
              </Link>
            ) : null}
            {heroCovers[0] ? (
              <Link href={localePath(locale, "/product/12-week-reset")} className="absolute top-10 start-0 z-20 w-60 -rotate-6">
                <Cover product={heroCovers[0]} decorative />
                <span className="sr-only">{heroCovers[0].title}</span>
              </Link>
            ) : null}
            {heroCovers[1] ? (
              <Link href={localePath(locale, "/product/the-quiet-budget")} className="absolute bottom-2 start-28 z-30 w-52 rotate-2">
                <Cover product={heroCovers[1]} decorative />
                <span className="sr-only">{heroCovers[1].title}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-y bg-card/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.perks.map((item, index) => {
            const Icon = icons[index] ?? Download;
            return (
              <div key={item.title} className="flex min-w-0 gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-copper" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {bundle ? (
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
          <Link href={localePath(locale, `/product/${bundle.slug}`)} className="mx-auto w-full max-w-sm">
            <Cover product={bundle} decorative />
            <span className="sr-only">{bundle.title}</span>
          </Link>
          <div className="min-w-0">
            <p className="text-xs tracking-[0.18em] text-copper uppercase">{t.home.bundleEyebrow(savings)}</p>
            <h2 dir={textDir(bundle.title)} className="mt-2 font-serif text-4xl">
              {bundle.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{bundle.description[0]}</p>
            <Price price={bundle.price} compareAt={bundle.compareAtPrice} previousPrice={bundle.previousPrice} size="lg" className="mt-5" />
            <p className="mt-2 text-sm text-muted-foreground">{t.home.pagesAcross(pageCountFor(bundle))}</p>
            <LinkButton href={`/product/${bundle.slug}`} className="mt-6 h-11 px-5">
              {t.home.viewBundle}
            </LinkButton>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl">{t.home.featured}</h2>
          <Link href={localePath(locale, "/shop")} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">
            {t.home.shopAll}
          </Link>
        </div>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-3xl">{t.home.categories}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {localizedCategories(locale).map((category) => (
            <Link
              key={category.slug}
              href={localePath(locale, `/shop?category=${category.slug}`)}
              className="rounded-xl border bg-card p-4 transition hover:border-foreground/30"
            >
              <h3 className="font-serif text-xl">{category.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
          {t.home.steps.map((item) => (
            <div key={item.step} className="min-w-0">
              <p className="text-xs tracking-[0.18em] text-copper">{item.step}</p>
              <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl">{t.home.journal}</h2>
          <Link href={localePath(locale, "/blog")} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">
            {t.home.allArticles}
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {postsForLocale(locale).slice(0, 3).map((post) => (
            <Link key={post.slug} href={localePath(locale, `/blog/${post.slug}`)} className="min-w-0 rounded-2xl border bg-card p-5 hover:border-foreground/30">
              <p className="text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
              <h3 dir={textDir(post.title)} className="mt-2 font-serif text-2xl">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="font-serif text-3xl">{t.home.questions}</h2>
        <div className="mt-6">
          <FaqList items={homeFaqs} />
        </div>
        <Link href={localePath(locale, "/faq")} className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4">
          {t.home.fullFaq}
        </Link>
      </section>

      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-2 md:items-center">
          <div className="min-w-0">
            <h2 className="font-serif text-4xl">{t.home.noteTitle}</h2>
            <p className="mt-3 max-w-md text-background/75">{t.home.noteText}</p>
          </div>
          <NewsletterForm inverted />
        </div>
      </section>
    </div>
  );
}
