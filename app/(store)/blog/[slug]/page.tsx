import { ArticleBody } from "@/components/article-body";
import { JsonLd } from "@/components/json-ld";
import { LinkButton } from "@/components/link-button";
import { getPost, postPath, posts, postsForProduct, resolvePostSeo } from "@/data/blog";
import { getProduct } from "@/data/products";
import { pageMetadata } from "@/lib/page-meta";
import { readingMinutes } from "@/lib/reading";
import { articleSchema, breadcrumbList } from "@/lib/schema";
import { CANONICAL_ORIGIN, canonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return posts.filter((post) => (post.lang ?? "en") === "en").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || (post.lang ?? "en") === "ar") return { title: "Journal" };
  const seo = resolvePostSeo(post);
  const translation = post.translationOf ? getPost(post.translationOf) : undefined;
  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: postPath(post),
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.date,
    enPath: postPath(post),
    arPath: translation ? postPath(translation) : undefined,
    image: `/blog/${post.slug}/opengraph-image`,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || (post.lang ?? "en") === "ar") notFound();
  const related = post.relatedProduct ? getProduct(post.relatedProduct) : undefined;
  const more = postsForProduct(post.relatedProduct ?? "").filter((item) => item.slug !== post.slug).slice(0, 3);
  const url = canonicalUrl(postPath(post));

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <JsonLd data={articleSchema(post, CANONICAL_ORIGIN, url)} />
      <JsonLd
        data={breadcrumbList([
          { name: "Home", url: CANONICAL_ORIGIN },
          { name: "Journal", url: canonicalUrl("/blog") },
          { name: post.title, url },
        ])}
      />
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link href="/blog" className="hover:underline">
          Journal
        </Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">{post.title}</span>
      </nav>
      <p className="mt-6 text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Vellum Press · {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(post.date))} ·{" "}
        {readingMinutes(post)} min read
      </p>
      <ArticleBody blocks={post.blocks} />
      {related ? (
        <aside className="mt-12 rounded-2xl border bg-card p-5">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">The PDF</p>
          <h2 className="mt-2 font-serif text-2xl">{related.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{related.shortDescription}</p>
          <p className="mt-2 text-sm">${related.price} · instant download · all sales final</p>
          <LinkButton href={`/product/${related.slug}`} className="mt-4 h-10 px-4">
            View {related.title}
          </LinkButton>
        </aside>
      ) : null}
      {more.length ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">More on this shelf</h2>
          <ul className="mt-3 space-y-2">
            {more.map((item) => (
              <li key={item.slug}>
                <Link href={postPath(item)} className="underline underline-offset-4">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
