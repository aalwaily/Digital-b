import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { PurchaseActions } from "@/components/purchase-actions";
import { getCategory, getProduct, isBundle, products } from "@/data/products";
import { reviewsFor } from "@/data/reviews";
import { pageCountFor, relatedProducts, samplePageCount } from "@/lib/catalog";
import { breadcrumbSchema, faqSchema, productSchema } from "@/lib/schema";
import { getSiteUrl } from "@/lib/site-url";
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
  return {
    title: product.title,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const related = relatedProducts(product.slug);
  const reviews = reviewsFor(product.slug);
  const pages = pageCountFor(product);
  const siteUrl = getSiteUrl();
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
          <div className="mt-4 space-y-2">
            {sampleTargets.map((sampleSlug) => {
              const sampleProduct = getProduct(sampleSlug);
              const samplePages = samplePageCount(sampleSlug);
              return (
                <a
                  key={sampleSlug}
                  href={`/samples/${sampleSlug}-sample.pdf`}
                  className="block text-sm underline underline-offset-4"
                  download
                >
                  Download free sample{sampleProduct && isBundle(product) ? `: ${sampleProduct.title}` : ""}
                  {samplePages ? ` (${samplePages} pages)` : ""}
                </a>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Personal use. Print a copy for yourself. Do not redistribute the file.
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

      <section className="mt-14">
        <h2 className="font-serif text-3xl">Questions about this guide</h2>
        <div className="mt-4">
          <FaqList items={product.faqs} />
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">Sample reviews</p>
          <h2 className="mt-2 font-serif text-3xl">Reviews</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These reviews are sample content for the template. They are not from verified buyers.
          </p>
        </div>
        {reviews.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No sample reviews for this guide yet.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm">
                    <span className="sr-only">{review.rating} out of 5 stars.</span>
                    <span aria-hidden>{ "★".repeat(review.rating) }{ "☆".repeat(5 - review.rating) }</span>
                  </p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs tracking-wide uppercase">Sample</span>
                </div>
                <h3 className="mt-3 font-serif text-xl">{review.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
                <p className="mt-3 text-xs text-muted-foreground">{review.name}</p>
              </article>
            ))}
          </div>
        )}
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
