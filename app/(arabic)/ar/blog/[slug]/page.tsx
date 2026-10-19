import { ArticleBody } from "@/components/article-body";
import { JsonLd } from "@/components/json-ld";
import { LinkButton } from "@/components/link-button";
import { getPost, postPath, posts, resolvePostSeo } from "@/data/blog";
import { getProduct } from "@/data/products";
import { arabicProducts } from "@/data/arabic-catalog";
import { pageMetadata } from "@/lib/page-meta";
import { readingMinutes } from "@/lib/reading";
import { articleSchema, breadcrumbList } from "@/lib/schema";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return posts.filter((post) => post.lang === "ar").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.lang !== "ar") return { title: "مقال" };
  const seo = resolvePostSeo(post);
  const translation = post.translationOf ? getPost(post.translationOf) : undefined;
  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: postPath(post),
    locale: "ar",
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.date,
    enPath: translation ? postPath(translation) : "/blog",
    arPath: postPath(post),
    image: "/blog/opengraph-image",
  });
}

export default async function ArabicPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.lang !== "ar") notFound();
  const related = post.relatedProduct ? getProduct(post.relatedProduct) : undefined;
  const url = canonicalUrl(postPath(post));
  const translation = post.translationOf ? getPost(post.translationOf) : undefined;

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <JsonLd data={articleSchema(post, CANONICAL_ORIGIN, url)} />
      <JsonLd
        data={breadcrumbList([
          { name: "الرئيسية", url: `${CANONICAL_ORIGIN}/ar` },
          { name: "المدونة", url: canonicalUrl("/ar/blog") },
          { name: post.title, url },
        ])}
      />
      <nav className="text-sm text-muted-foreground" aria-label="مسار">
        <Link href="/ar" className="hover:underline">
          الرئيسية
        </Link>
        <span aria-hidden> / </span>
        <Link href="/ar/blog" className="hover:underline">
          المدونة
        </Link>
      </nav>
      <p className="mt-6 text-xs tracking-[0.16em] text-copper">{post.category}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Vellum Press · {new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(new Date(post.date))} ·{" "}
        {readingMinutes(post)} دقائق قراءة
      </p>
      <ArticleBody blocks={post.blocks} />
      {related ? (
        <aside className="mt-12 rounded-2xl border bg-card p-5">
          <p className="text-xs tracking-[0.16em] text-copper">الملف</p>
          <h2 className="mt-2 font-serif text-2xl">{arabicProducts[related.slug]?.title ?? related.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">الدليل باللغة الإنجليزية. ${related.price} عبر PayPal. جميع المبيعات نهائية.</p>
          <LinkButton href={`/ar/product/${related.slug}`} className="mt-4 h-10 px-4">
            صفحة الشراء
          </LinkButton>
          {translation ? (
            <p className="mt-4 text-sm">
              <Link href={postPath(translation)} hrefLang="en" lang="en" className="underline underline-offset-4">
                English article
              </Link>
            </p>
          ) : null}
        </aside>
      ) : null}
    </article>
  );
}
