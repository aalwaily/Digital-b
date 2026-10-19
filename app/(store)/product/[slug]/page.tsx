import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { PurchaseActions } from "@/components/purchase-actions";
import { SampleRequest } from "@/components/sample-request";
import { ShareProduct } from "@/components/share-product";
import { postPath, postsForProduct } from "@/data/blog";
import { productSeo } from "@/data/page-seo";
import { getCategory, getProduct, isBundle, products } from "@/data/products";
import { site } from "@/data/site";
import { pageCountFor, relatedProducts, samplePageCount } from "@/lib/catalog";
import { pageMetadata } from "@/lib/page-meta";
import { breadcrumbSchema, faqSchema, productSchema } from "@/lib/schema";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Guide" };
  const seo = productSeo[product.slug];
  return pageMetadata({
    title: seo?.title ?? product.title,
    description: seo?.description ?? product.shortDescription,
    path: `/product/${product.slug}`,
    enPath: `/product/${product.slug}`,
    arPath: `/ar/product/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const related = relatedProducts(product.slug);
  const pages = pageCountFor(product);
  const siteUrl = CANONICAL_ORIGIN;
  const journal = postsForProduct(product.slug);
  const sampleTargets = isBundle(product) ? product.includes : [product.slug];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <JsonLd data={productSchema(product, siteUrl)} />
      <JsonLd data={faqSchema(product.faqs)} />
      <JsonLd data={breadcrumbSchema(siteUrl, product)} />
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span aria-hidden> / </span>
        <Link href="/shop" className="hover:underline">Shop</Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">{product.title}</span>
      </nav>
      <p className="mt-3 text-sm">
        <Link href={`/ar/product/${product.slug}`} hrefLang="ar" lang="ar" className="underline underline-offset-4">
          اقرأ الصفحة بالعربية
        </Link>
        <span className="text-muted-foreground"> · الدليل باللغة الإنجليزية</span>
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ProductGallery product={product} />
        <div>
          <p className="text-xs tracking-[0.18em] text-copper uppercase">{category?.name}</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">{product.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{product.subtitle}</p>
          <Price price={product.price} compareAt={product.compareAtPrice} size="lg" className="mt-5" />
          <p className="mt-2 text-sm text-muted-foreground">
            {pages} pages · One-time purchase · Personal license
          </p>
          <div className="mt-6">
            <PurchaseActions slug={product.slug} />
          </div>
          <div className="mt-4">
            <SampleRequest
              slug={product.slug}
              samples={sampleTargets.flatMap((sampleSlug) => {
                const sampleProduct = getProduct(sampleSlug);
                if (!sampleProduct) return [];
                return [{ slug: sampleSlug, title: sampleProduct.title, pages: samplePageCount(sampleSlug) }];
              })}
            />
          </div>
          <ShareProduct title={product.title} url={`${siteUrl}/product/${product.slug}`} />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Personal use. Print a copy for yourself. Do not redistribute the file.{" "}
            <Link href="/legal/refunds" className="underline underline-offset-4">
              All sales are final
            </Link>
            . If a file is corrupted, missing, or the download link fails, email{" "}
            <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            and we will re-send a working copy.
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 text-[1.05rem] leading-relaxed">
          {product.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div>
          <h2 className="font-serif text-2xl">What&apos;s included</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            {product.included.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-copper">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isBundle(product) ? (
        <section className="mt-14">
          <h2 className="font-serif text-3xl">In this bundle</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {product.includes.map((included) => {
              const guide = getProduct(included);
              return guide ? <ProductCard key={guide.slug} product={guide} /> : null;
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="font-serif text-3xl">Table of contents</h2>
        <ol className="mt-4 divide-y rounded-2xl border bg-card">
          {product.contents.map((item, index) => (
            <li key={item} className="flex gap-4 px-4 py-3 text-sm">
              <span className="w-8 text-copper">{String(index + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      {journal.length ? (
        <section className="mt-14">
          <h2 className="font-serif text-3xl">Read before you buy</h2>
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
        <h2 className="font-serif text-3xl">Questions about this guide</h2>
        <div className="mt-4">
          <FaqList items={product.faqs} />
        </div>
      </section>

      {!isBundle(product) && related.length ? (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">Related</h2>
          <div className={`mt-6 grid gap-8 ${isBundle(product) ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
