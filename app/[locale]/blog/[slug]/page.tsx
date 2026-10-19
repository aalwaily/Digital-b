import { ArticleBody } from "@/components/article-body";
import { JsonLd } from "@/components/json-ld";
import { LinkButton } from "@/components/link-button";
import { getPost, postPath, posts, resolvePostSeo } from "@/data/blog";
import { textDir } from "@/lib/i18n/bidi";
import { formatLongDate, localizePost, localizedProduct, requireLocale } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { readingMinutes } from "@/lib/reading";
import { articleSchema } from "@/lib/schema";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { locale: string; slug: string };

function visibleIn(locale: Locale, slug: string) {
  const post = getPost(slug);
  if (!post) return false;
  if (locale === "en" && post.lang === "ar") return false;
  if (locale === "ar" && post.lang === "en") return false;
  return true;
}

function articleLanguages(slug: string) {
  const post = getPost(slug);
  if (!post?.translationOf) return undefined;
  const other = getPost(post.translationOf);
  if (!other) return undefined;
  const en = post.lang === "ar" ? postPath(other) : postPath(post);
  const ar = post.lang === "ar" ? postPath(post) : postPath(other);
  return { en, ar, "x-default": en };
}

export function generateStaticParams() {
  return posts.flatMap((post) => {
    const locales: Locale[] = post.lang === "ar" ? ["ar"] : post.lang === "en" ? ["en"] : ["en", "ar"];
    return locales.map((locale) => ({ locale, slug: post.slug }));
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const t = getDictionary(locale);
  const source = getPost(slug);
  if (!source || !visibleIn(locale, slug)) return { title: t.blog.metaTitle };
  const post = localizePost(source, locale);
  const seo = source.lang || locale === "en" ? resolvePostSeo(source) : undefined;
  return pageMetadata({
    title: seo?.title ?? post.title,
    description: seo?.description ?? post.description,
    path: `/blog/${post.slug}`,
    locale,
    absoluteTitle: Boolean(seo),
    type: "article",
    publishedTime: post.date,
    languages: articleLanguages(slug),
  });
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const t = getDictionary(locale);
  const source = getPost(slug);
  if (!source || !visibleIn(locale, slug)) notFound();
  const post = localizePost(source, locale);
  const related = post.relatedProduct ? localizedProduct(post.relatedProduct, locale) : undefined;
  const minutes = post.longform ? readingMinutes(post) : post.readingMinutes;

  return (
    <article className="mx-auto min-w-0 max-w-3xl px-5 py-12">
      <JsonLd data={articleSchema(post, getSiteUrl(), locale)} />
      <p className="text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
      <h1 dir={textDir(post.title)} className="mt-2 font-serif text-4xl md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {formatLongDate(post.date, locale)} · {t.blog.minutes(minutes)}
      </p>
      <ArticleBody blocks={post.blocks} />
      {related ? (
        <aside className="mt-12 rounded-2xl border bg-card p-5">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">{t.blog.theGuide}</p>
          <h2 dir={textDir(related.title)} className="mt-2 font-serif text-2xl">
            {related.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{related.shortDescription}</p>
          <LinkButton href={`/product/${related.slug}`} className="mt-4 h-11 px-4">
            {t.blog.view(related.title)}
          </LinkButton>
        </aside>
      ) : null}
    </article>
  );
}
