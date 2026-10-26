import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductStickyBar } from "@/components/product-sticky-bar";
import { PaymentSoon } from "@/components/payment-soon";
import { PurchaseActions } from "@/components/purchase-actions";
import { SamplePreview } from "@/components/sample-preview";
import { SampleRequest } from "@/components/sample-request";
import { ShareProduct } from "@/components/share-product";
import { isBundle, products, type Product } from "@/data/products";
import { site } from "@/data/site";
import { audienceFor } from "@/data/audience";
import { approximateKilobytes, fileFacts, pageCountFor, relatedProducts, samplePageCount } from "@/lib/catalog";
import { samplePreviewSrc, SAMPLE_PREVIEW } from "@/lib/sample-preview";
import { textDir, stripBidiIsolates } from "@/lib/i18n/bidi";
import { localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionary";
import { localizeCategory, localizeProduct, localizedProduct, requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import { arabicProductSeo, productSeo } from "@/data/page-seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EnglishPdfNotice } from "@/components/english-pdf-notice";
import { breadcrumbSchema, faqSchema, productSchema } from "@/lib/schema";
import { limitFor } from "@/data/limits";
import { sourcesFor } from "@/data/sources";
import { checkoutOptions } from "@/lib/payments";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { locale: string; slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const product = localizedProduct(slug, locale);
  if (!product) return { title: "Guide" };
  const seo = locale === "ar" ? arabicProductSeo[slug] : productSeo[slug];
  return pageMetadata({
    title: seo?.title ?? product.title,
    description: seo?.description ?? product.shortDescription,
    path: `/product/${product.slug}`,
    locale,
    absoluteTitle: Boolean(seo),
  });
}

function relationNote(current: Product, related: Product, t: Dictionary) {
  if (isBundle(related) && related.includes.includes(current.slug)) return t.product.includedInBundle;
  if (related.category === current.category && current.category !== "bundles") return t.product.sameCategory;
  return null;
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const t = getDictionary(locale);
  const product = localizedProduct(slug, locale);
  if (!product) notFound();
  const category = localizeCategory(product.category, locale);
  const related = relatedProducts(product.slug).map((item) => localizeProduct(item, locale));
  const facts = fileFacts(product);
  const siteUrl = getSiteUrl();
  const sampleTargets = isBundle(product) ? product.includes : [product.slug];
  const productPath = localePath(locale, `/product/${product.slug}`);
  const paymentsOpen = checkoutOptions().open;
  const sources = sourcesFor(product.slug, locale);
  const limit = limitFor(product.slug, locale);
  const audience = audienceFor(product.slug, locale);
  const slides = previewSlides(sampleTargets, locale, t);
  const specPills = [
    t.product.pages(facts.pages),
    t.product.formatValue,
    facts.samplePages > 0 ? t.product.samplePill(facts.samplePages) : null,
    t.product.paperValue,
    t.product.languageValue,
    facts.files > 1 ? t.product.filesValue(facts.files) : null,
    facts.bytes > 0 ? t.product.sizeValue(approximateKilobytes(facts.bytes)) : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-6 sm:px-5 sm:py-10">
      <JsonLd data={productSchema(product, CANONICAL_ORIGIN, locale)} />
      <JsonLd data={faqSchema(product.faqs)} />
      <JsonLd data={breadcrumbSchema(CANONICAL_ORIGIN, product, locale)} />
      <Breadcrumbs
        label={t.product.breadcrumb}
        locale={locale}
        items={[
          { href: localePath(locale, "/"), label: t.product.home },
          { href: localePath(locale, "/shop"), label: t.product.shop },
          { label: product.title },
        ]}
      />

      <div className="mt-4 grid min-w-0 gap-8 lg:mt-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <div className="order-1 min-w-0 lg:order-2">
          <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{category?.name}</p>
          <h1 dir={textDir(product.title)} className="mt-2 font-serif text-3xl leading-tight md:text-4xl lg:text-5xl">
            {product.title}
          </h1>
          <p dir={textDir(product.subtitle)} className="mt-2 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {product.subtitle}
          </p>
          <div id="product-purchase">
            <Price price={product.price} compareAt={product.compareAtPrice} previousPrice={product.previousPrice} size="lg" className="mt-4" />
            <div className="mt-3">
              <PurchaseActions slug={product.slug} />
            </div>
          </div>
          {locale === "ar" ? (
            <div className="mt-4">
              <EnglishPdfNotice />
            </div>
          ) : null}
          <ul aria-label={t.product.specs} className="mt-4 flex flex-wrap gap-1.5">
            {specPills.map((pill) => (
              <li key={pill} className="rounded-full bg-card px-2.5 py-1 text-sm leading-5 ring-1 ring-border">
                {pill}
              </li>
            ))}
          </ul>
          {paymentsOpen ? null : (
            <div className="mt-4">
              <PaymentSoon slugs={[product.slug]} />
            </div>
          )}
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t.product.emailLead}{" "}
            <a dir="ltr" className="text-foreground underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            {t.product.resend}{" "}
            <Link href={localePath(locale, "/legal/refunds")} className="text-foreground underline underline-offset-4">
              {t.product.salesFinal}
            </Link>
            .
          </p>
          {audience.length ? (
            <section aria-labelledby="for-whom" className="mt-5 rounded-2xl border bg-card px-4 py-3">
              <h2 id="for-whom" className="font-serif text-xl">
                {t.product.forWhom}
              </h2>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                {audience.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="order-2 min-w-0 lg:order-1">
          <section aria-labelledby="preview-heading">
            <h2 id="preview-heading" className="font-serif text-2xl">
              {t.product.previewTitle}
            </h2>
            <div className="mt-3 flex flex-col gap-4">
              <SamplePreview slides={slides} className="order-1 lg:order-2" />
              <ProductGallery product={product} className="order-2 mx-auto w-full max-w-[22rem] lg:order-1 lg:max-w-none" />
            </div>
          </section>
          <div className="mx-auto mt-4 w-full max-w-[22rem] lg:max-w-none">
            <SampleRequest
              slug={product.slug}
              samples={sampleTargets.flatMap((sampleSlug) => {
                const sampleProduct = localizedProduct(sampleSlug, locale);
                if (!sampleProduct) return [];
                return [{ slug: sampleSlug, title: sampleProduct.title, pages: samplePageCount(sampleSlug) }];
              })}
            />
          </div>
        </div>
      </div>

      <section className="mt-12 min-w-0" aria-labelledby="included-heading">
        <h2 id="included-heading" className="font-serif text-2xl sm:text-3xl">
          {t.product.included}
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {product.included.map((item) => (
            <li key={item} className="flex min-w-0 gap-2 rounded-xl border bg-card px-3 py-3 text-sm leading-relaxed">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-copper" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 min-w-0 space-y-4 text-[1.05rem] leading-relaxed">
        <h2 className="font-serif text-2xl sm:text-3xl">{t.product.about}</h2>
        {product.description.map((paragraph) => (
          <p key={paragraph} dir={textDir(paragraph)}>
            {paragraph}
          </p>
        ))}
      </div>

      {isBundle(product) ? (
        <section className="mt-12 min-w-0">
          <h2 className="font-serif text-2xl sm:text-3xl">{t.product.inBundle}</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {product.includes.map((included) => {
              const guide = localizedProduct(included, locale);
              return guide ? <ProductCard key={guide.slug} product={guide} layout="responsive" /> : null;
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-12 min-w-0" aria-labelledby="contents-heading">
        <h2 id="contents-heading" className="font-serif text-2xl sm:text-3xl">
          {t.product.contents}
          <span className="ms-2 font-sans text-base font-normal text-muted-foreground">{t.product.sections(product.contents.length)}</span>
        </h2>
        <ol className="mt-4 divide-y rounded-2xl border bg-card">
          {product.contents.map((item, index) => (
            <li key={item} className="flex gap-4 px-4 py-3 text-sm">
              <span className="w-8 shrink-0 text-copper tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 min-w-0" aria-labelledby="delivery">
        <h2 id="delivery" className="font-serif text-2xl sm:text-3xl">
          {t.product.deliveryTitle}
        </h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed">
          <li>{t.product.deliveryBody(site.downloadDays)}</li>
          {paymentsOpen ? null : <li>{t.product.deliveryClosed}</li>}
          <li>
            {t.product.license}{" "}
            <Link href={localePath(locale, "/legal/refunds")} className="inline-flex min-h-11 items-center underline underline-offset-4">
              {t.product.salesFinal}
            </Link>
            .
          </li>
          <li>
            {t.product.emailLead}{" "}
            <a dir="ltr" className="inline-flex min-h-11 items-center underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            {t.product.resend}
          </li>
        </ul>
      </section>

      {limit ? (
        <section className="mt-12 min-w-0 rounded-2xl border bg-card px-4 py-4 sm:px-5" aria-labelledby="limit-heading">
          <h2 id="limit-heading" className="font-serif text-2xl sm:text-3xl">
            {t.product.limit}
          </h2>
          <p dir={textDir(limit)} className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {limit}
          </p>
        </section>
      ) : null}

      {sources.length ? (
        <section className="mt-12 min-w-0">
          <h2 className="font-serif text-2xl sm:text-3xl">{t.product.sources}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.product.sourcesNote}</p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed">
            {sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} className="inline-flex min-h-11 min-w-11 items-center underline underline-offset-4" rel="noopener noreferrer">
                  {source.label}
                </a>
                <span className="mt-1 block text-muted-foreground">{source.note}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12" aria-labelledby="questions-heading">
        <h2 id="questions-heading" className="font-serif text-2xl sm:text-3xl">
          {t.product.questions}
        </h2>
        <div className="mt-4">
          <FaqList items={product.faqs} />
        </div>
      </section>

      <div className="mt-10">
        <ShareProduct title={stripBidiIsolates(product.title)} url={`${siteUrl}${productPath}`} />
      </div>

      {!isBundle(product) && related.length ? (
        <section className="mt-14 min-w-0" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-serif text-2xl sm:text-3xl">
            {t.product.related}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.product.relatedLead}</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => {
              const note = relationNote(product, item, t);
              return (
                <div key={item.slug} className="min-w-0">
                  {note ? <p className="mb-2 text-xs font-medium text-copper">{note}</p> : null}
                  <ProductCard product={item} layout="responsive" />
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <ProductStickyBar
        slug={product.slug}
        price={product.price}
        compareAt={product.compareAtPrice}
        previousPrice={product.previousPrice}
      />
    </div>
  );
}

function previewSlides(slugs: string[], locale: Locale, t: Dictionary) {
  return slugs.flatMap((previewSlug) => {
    const guide = localizedProduct(previewSlug, locale);
    const source = guide ? pageCountFor(guide) : null;
    const samplePages = samplePageCount(previewSlug);
    if (!guide || source == null || samplePages == null) return [];
    return [
      {
        slug: previewSlug,
        src: samplePreviewSrc(previewSlug),
        alt: t.product.samplePageAlt(stripBidiIsolates(guide.title), SAMPLE_PREVIEW.page),
        caption: t.product.samplePageCaption(SAMPLE_PREVIEW.page, samplePages, source),
      },
    ];
  });
}
