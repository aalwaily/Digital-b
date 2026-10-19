import { EnglishPdfNotice } from "@/components/english-pdf-notice";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { LinkButton } from "@/components/link-button";
import { PurchaseActions } from "@/components/purchase-actions";
import { arabicHomeFaqs, arabicProducts } from "@/data/arabic-catalog";
import { orderedPosts, postPath } from "@/data/blog";
import { staticSeo } from "@/data/page-seo";
import { products } from "@/data/products";
import { pageCountFor } from "@/lib/catalog";
import { pageMetadata } from "@/lib/page-meta";
import { faqSchema } from "@/lib/schema";
import { formatSar } from "@/lib/sar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: staticSeo.arabicHome.title,
  description: staticSeo.arabicHome.description,
  path: "/ar",
  locale: "ar",
  enPath: "/",
  arPath: "/ar",
  image: "/opengraph-image",
});

const buyLabels = { add: "أضف إلى السلة", inCart: "في السلة", buy: "اشتر الآن" };

export default function ArabicHomePage() {
  const journal = orderedPosts("ar");
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <JsonLd data={faqSchema(arabicHomeFaqs)} />
      <p className="text-xs tracking-[0.16em] text-copper">فيلوم بريس · الدمام</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">أدلة PDF تشتريها مرة وتحتفظ بها</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        خطط وقوالب عملية: ميزانية، سيرة ذاتية، عمل حر، وأكل وتمرين. الدفع عبر PayPal بالدولار. السعر بالريال تقريبي
        بسعر 3.75. جميع المبيعات نهائية.
      </p>
      <div className="mt-6 max-w-2xl">
        <EnglishPdfNotice />
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="#guides" className="h-11 px-5">
          تصفح الأدلة
        </LinkButton>
        <LinkButton href="/ar/blog" variant="outline" className="h-11 px-5">
          اقرأ قبل الشراء
        </LinkButton>
      </div>

      <section id="guides" className="mt-16 scroll-mt-24">
        <h2 className="font-serif text-3xl">المتجر</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const copy = arabicProducts[product.slug];
            const pages = pageCountFor(product);
            return (
              <article key={product.slug} className="flex h-full flex-col rounded-2xl border bg-card p-5">
                <h3 className="font-serif text-2xl">
                  <Link href={`/ar/product/${product.slug}`} className="hover:underline">
                    {copy?.title ?? product.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{copy?.subtitle}</p>
                <p className="mt-3 text-sm">
                  ${product.price} · حوالي {formatSar(product.price)} · {pages} صفحة
                </p>
                <div className="mt-3">
                  <PurchaseActions slug={product.slug} labels={buyLabels} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">مقالات قبل الشراء</h2>
        <ul className="mt-4 space-y-3">
          {journal.map((post) => (
            <li key={post.slug}>
              <Link href={postPath(post)} className="underline underline-offset-4">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-3xl">أسئلة</h2>
        <div className="mt-4">
          <FaqList items={arabicHomeFaqs} />
        </div>
      </section>
    </div>
  );
}
