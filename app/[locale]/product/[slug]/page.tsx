import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { PurchaseActions } from "@/components/purchase-actions";
import { SampleRequest } from "@/components/sample-request";
import { ShareProduct } from "@/components/share-product";
import { isBundle, products } from "@/data/products";
import { site } from "@/data/site";
import { pageCountFor, relatedProducts, samplePageCount } from "@/lib/catalog";
import { textDir } from "@/lib/i18n/bidi";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizeCategory, localizeProduct, localizedProduct, requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import { arabicProductSeo, productSeo } from "@/data/page-seo";
import { EnglishPdfNotice } from "@/components/english-pdf-notice";
import { breadcrumbSchema, faqSchema, productSchema } from "@/lib/schema";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { locale: string; slug: string };

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

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const t = getDictionary(locale);
  const product = localizedProduct(slug, locale);
  if (!product) notFound();
  const category = localizeCategory(product.category, locale);
  const related = relatedProducts(product.slug).map((item) => localizeProduct(item, locale));
  const pages = pageCountFor(product);
  const siteUrl = getSiteUrl();
  const sampleTargets = isBundle(product) ? product.includes : [product.slug];
  const productPath = localePath(locale, `/product/${product.slug}`);

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-5 py-10 pb-28 lg:pb-10">
      <JsonLd data={productSchema(product, siteUrl, locale)} />
      <JsonLd data={faqSchema(product.faqs)} />
      <JsonLd data={breadcrumbSchema(siteUrl, product, locale)} />
      <nav className="text-sm text-muted-foreground" aria-label={t.product.breadcrumb}>
        <Link href={localePath(locale, "/")} className="inline-flex min-h-11 items-center hover:underline">
          {t.product.home}
        </Link>
        <span aria-hidden> / </span>
        <Link href={localePath(locale, "/shop")} className="inline-flex min-h-11 items-center hover:underline">
          {t.product.shop}
        </Link>
        <span aria-hidden> / </span>
        <span dir={textDir(product.title)} className="text-foreground">
          {product.title}
        </span>
      </nav>

      <div className="mt-6 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ProductGallery product={product} />
        <div className="min-w-0">
          <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{category?.name}</p>
          <h1 dir={textDir(product.title)} className="mt-2 font-serif text-4xl md:text-5xl">
            {product.title}
          </h1>
          <p dir={textDir(product.subtitle)} className="mt-3 text-lg text-muted-foreground">
            {product.subtitle}
          </p>
          <Price price={product.price} compareAt={product.compareAtPrice} size="lg" className="mt-5" />
          <p className="mt-2 text-sm text-muted-foreground">{t.product.meta(pages)}</p>
          {locale === "ar" ? (
            <div className="mt-4">
              <EnglishPdfNotice />
            </div>
          ) : null}
          <div className="mt-6">
            <PurchaseActions slug={product.slug} />
          </div>
          <div className="mt-4">
            <SampleRequest
              slug={product.slug}
              samples={sampleTargets.flatMap((sampleSlug) => {
                const sampleProduct = localizedProduct(sampleSlug, locale);
                if (!sampleProduct) return [];
                return [{ slug: sampleSlug, title: sampleProduct.title, pages: samplePageCount(sampleSlug) }];
              })}
            />
          </div>
          <ShareProduct title={product.title} url={`${siteUrl}${productPath}`} />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t.product.license}{" "}
            <Link href={localePath(locale, "/legal/refunds")} className="underline underline-offset-4">
              {t.product.salesFinal}
            </Link>
            . {t.product.emailLead}{" "}
            <a dir="ltr" className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            {t.product.resend}
          </p>
        </div>
      </div>

      <div className="mt-14 grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="min-w-0 space-y-4 text-[1.05rem] leading-relaxed">
          {product.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="min-w-0">
          <h2 className="font-serif text-2xl">{t.product.included}</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            {product.included.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-copper">
                  ▸
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isBundle(product) ? (
        <section className="mt-14 min-w-0">
          <h2 className="font-serif text-3xl">{t.product.inBundle}</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {product.includes.map((included) => {
              const guide = localizedProduct(included, locale);
              return guide ? <ProductCard key={guide.slug} product={guide} /> : null;
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-14 min-w-0">
        <h2 className="font-serif text-3xl">{t.product.contents}</h2>
        <ol className="mt-4 divide-y rounded-2xl border bg-card">
          {product.contents.map((item, index) => (
            <li key={item} className="flex gap-4 px-4 py-3 text-sm">
              <span className="w-8 shrink-0 text-copper">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-3xl">{t.product.questions}</h2>
        <div className="mt-4">
          <FaqList items={product.faqs} />
        </div>
      </section>

      {!isBundle(product) && related.length ? (
        <section className="mt-16 min-w-0">
          <h2 className="font-serif text-3xl">{t.product.related}</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <PurchaseActions slug={product.slug} row />
      </div>
    </div>
  );
}
