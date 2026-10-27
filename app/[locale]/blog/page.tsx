import { textDir } from "@/lib/i18n/bidi";
import { localePath } from "@/lib/i18n/config";
import { formatLongDate, postsForLocale, requireLocale } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import { readingMinutes } from "@/lib/reading";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  return pageMetadata(publicMetadata(locale, "/blog")!);
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const posts = postsForLocale(locale);

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.blog.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{t.blog.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.blog.lede}</p>
      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-8">
            <p className="text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
            <h2 dir={textDir(post.title)} className="mt-2 font-serif text-3xl">
              <Link href={localePath(locale, `/blog/${post.slug}`)} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatLongDate(post.date, locale)} · {t.blog.minutes(post.longform ? readingMinutes(post) : post.readingMinutes)}
            </p>
            <p className="mt-3 leading-relaxed">{post.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
