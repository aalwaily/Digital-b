import { ArticleBody } from "@/components/article-body";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLdList } from "@/components/json-ld";
import { LinkButton } from "@/components/link-button";
import { getPost, posts } from "@/data/blog";
import { blogLocalesForSlug } from "@/lib/blog-index";
import { textDir } from "@/lib/i18n/bidi";
import { formatLongDate, localizePost, localizedProduct, requireLocale } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath, type Locale } from "@/lib/i18n/config";
import { pageJsonLd } from "@/lib/page-jsonld";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import { readingMinutes } from "@/lib/reading";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { locale: string; slug: string };

export const dynamicParams = false;

function visibleIn(locale: Locale, slug: string) {
  return blogLocalesForSlug(slug).includes(locale) && Boolean(getPost(slug));
}

export function generateStaticParams() {
  return posts.flatMap((post) => {
    const available: Locale[] = post.lang === "ar" ? ["ar"] : post.lang === "en" ? ["en"] : ["en", "ar"];
    return available.map((locale) => ({ locale, slug: post.slug }));
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale = requireLocale(raw);
  const t = getDictionary(locale);
  const meta = publicMetadata(locale, `/blog/${slug}`);
  if (!meta) return { title: t.blog.metaTitle };
  return pageMetadata(meta);
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
      <JsonLdList data={pageJsonLd(locale, `/blog/${post.slug}`)} />
      <Breadcrumbs
        label={t.product.breadcrumb}
        locale={locale}
        items={[
          { href: localePath(locale, "/"), label: t.crumbs.home },
          { href: localePath(locale, "/blog"), label: t.nav.journal },
          { label: post.title },
        ]}
      />
      <p className="mt-6 text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
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
          <LinkButton href={`/product/${related.slug}`} className="wrap-button mt-4 w-full px-4 py-2 sm:w-auto">
            {t.blog.view(related.title)}
          </LinkButton>
        </aside>
      ) : null}
    </article>
  );
}
