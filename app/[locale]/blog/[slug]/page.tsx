import { JsonLd } from "@/components/json-ld";
import { LinkButton } from "@/components/link-button";
import { posts } from "@/data/blog";
import { formatLongDate, localizedPost, localizedProduct, requireLocale } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/page-meta";
import { articleSchema } from "@/lib/schema";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const post = localizedPost(slug, locale);
  const t = getDictionary(locale);
  if (!post) return { title: t.blog.metaTitle };
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    locale,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const t = getDictionary(locale);
  const post = localizedPost(slug, locale);
  if (!post) notFound();
  const related = post.relatedProduct ? localizedProduct(post.relatedProduct, locale) : undefined;

  return (
    <article className="mx-auto min-w-0 max-w-3xl px-5 py-12">
      <JsonLd data={articleSchema(post, getSiteUrl(), locale)} />
      <p className="text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {formatLongDate(post.date, locale)} · {t.blog.minutes(post.readingMinutes)}
      </p>
      <div className="mt-8 space-y-4 text-[1.05rem] leading-relaxed">
        {post.blocks.map((block, index) => {
          if (block.type === "h2") {
            return (
              <h2 key={index} className="pt-6 font-serif text-3xl">
                {block.text}
              </h2>
            );
          }
          if (block.type === "ul") {
            return (
              <ul key={index} className="list-disc space-y-2 ps-5">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }
          if (block.type === "tip") {
            return (
              <p key={index} className="border-s-2 border-copper ps-4 text-base">
                {block.text}
              </p>
            );
          }
          return <p key={index}>{block.text}</p>;
        })}
      </div>
      {related ? (
        <aside className="mt-12 rounded-2xl border bg-card p-5">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">{t.blog.theGuide}</p>
          <h2 className="mt-2 font-serif text-2xl">{related.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{related.shortDescription}</p>
          <LinkButton href={`/product/${related.slug}`} className="mt-4 h-11 px-4">
            {t.blog.view(related.title)}
          </LinkButton>
        </aside>
      ) : null}
    </article>
  );
}
