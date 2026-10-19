import { EnglishPdfNotice } from "@/components/english-pdf-notice";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PurchaseActions } from "@/components/purchase-actions";
import { SampleRequest } from "@/components/sample-request";
import { ENGLISH_PDF_NOTICE, arabicProducts } from "@/data/arabic-catalog";
import { postPath, postsForProduct } from "@/data/blog";
import { arabicProductSeo } from "@/data/page-seo";
import { getProduct, isBundle, products } from "@/data/products";
import { site } from "@/data/site";
import { pageCountFor, relatedProducts, samplePageCount } from "@/lib/catalog";
import { pageMetadata } from "@/lib/page-meta";
import { breadcrumbList, faqSchema, productSchema } from "@/lib/schema";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const buyLabels = { add: "أضف إلى السلة", inCart: "في السلة", buy: "اشتر الآن" };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  const seo = arabicProductSeo[slug];
  if (!product || !seo) return { title: "دليل" };
  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/ar/product/${product.slug}`,
    locale: "ar",
    enPath: `/product/${product.slug}`,
    arPath: `/ar/product/${product.slug}`,
    image: `/product/${product.slug}/opengraph-image`,
  });
}

export default async function ArabicProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  const copy = arabicProducts[slug];
  if (!product || !copy) notFound();
  const pages = pageCountFor(product);
  const url = canonicalUrl(`/ar/product/${product.slug}`);
  const related = relatedProducts(product.slug);
  const journal = postsForProduct(product.slug).filter((post) => (post.lang ?? "en") === "ar");
  const sampleTargets = isBundle(product) ? product.includes : [product.slug];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <JsonLd
        data={productSchema(product, CANONICAL_ORIGIN, {
          name: copy.title,
          description: arabicProductSeo[product.slug]?.description,
          url,
        })}
      />
      <JsonLd data={faqSchema(copy.faqs)} />
      <JsonLd
        data={breadcrumbList([
          { name: "الرئيسية", url: CANONICAL_ORIGIN + "/ar" },
          { name: copy.title, url },
        ])}
      />
      <nav className="text-sm text-muted-foreground" aria-label="مسار">
        <Link href="/ar" className="hover:underline">
          الرئيسية
        </Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">{copy.title}</span>
      </nav>
      <p className="mt-3 text-sm">
        <Link href={`/product/${product.slug}`} hrefLang="en" lang="en" className="underline underline-offset-4">
          English page
        </Link>
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <EnglishPdfNotice />
          <p className="mt-4 text-sm text-muted-foreground">{pages} صفحة في الملف الإنجليزي · شراء مرة واحدة · رخصة شخصية</p>
        </div>
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">{copy.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{copy.subtitle}</p>
          <p className="mt-5 font-serif text-3xl">${product.price}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            حوالي {(product.price * 3.75).toFixed(2)} ر.س
            {product.compareAtPrice ? ` (بدلاً من ${product.compareAtPrice} دولاراً، نحو ${(product.compareAtPrice * 3.75).toFixed(2)} ر.س)` : ""}
            . السعر بالريال تقريبي بسعر 3.75. الدفع عبر PayPal بالدولار الأمريكي.
          </p>
          <div className="mt-6">
            <PurchaseActions slug={product.slug} labels={buyLabels} />
          </div>
          <div className="mt-4">
            <p className="mb-2 text-sm text-muted-foreground">النموذج المجاني باللغة الإنجليزية.</p>
            <SampleRequest
              slug={product.slug}
              samples={sampleTargets.flatMap((sampleSlug) => {
                const sampleProduct = getProduct(sampleSlug);
                if (!sampleProduct) return [];
                return [{ slug: sampleSlug, title: sampleProduct.title, pages: samplePageCount(sampleSlug) }];
              })}
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            استخدام شخصي. لا تعِد توزيع الملف.{" "}
            <Link href="/legal/refunds" className="underline underline-offset-4">
              جميع المبيعات نهائية
            </Link>
            . إذا فسد الملف أو نقص أو فشل رابط التحميل، راسل{" "}
            <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 text-[1.05rem] leading-relaxed">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>{ENGLISH_PDF_NOTICE}</p>
        </div>
        <div>
          <h2 className="font-serif text-2xl">ماذا يتضمن</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            {copy.benefits.map((item) => (
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

      {journal.length ? (
        <section className="mt-14">
          <h2 className="font-serif text-3xl">اقرأ قبل الشراء</h2>
          <ul className="mt-4 space-y-2">
            {journal.map((post) => (
              <li key={post.slug}>
                <Link href={postPath(post)} className="underline underline-offset-4">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="font-serif text-3xl">أسئلة عن هذا الدليل</h2>
        <div className="mt-4">
          <FaqList items={copy.faqs} />
        </div>
      </section>

      {related.length ? (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">أدلة قريبة</h2>
          <ul className="mt-4 space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/ar/product/${item.slug}`} className="underline underline-offset-4">
                  {arabicProducts[item.slug]?.title ?? item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
