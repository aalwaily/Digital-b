import { orderedPosts, postPath } from "@/data/blog";
import { staticSeo } from "@/data/page-seo";
import { pageMetadata } from "@/lib/page-meta";
import { readingMinutes } from "@/lib/reading";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: staticSeo.arabicBlog.title,
  description: staticSeo.arabicBlog.description,
  path: "/ar/blog",
  locale: "ar",
  enPath: "/blog",
  arPath: "/ar/blog",
  image: "/blog/opengraph-image",
});

export default function ArabicBlogPage() {
  const posts = orderedPosts("ar");
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.16em] text-copper">المدونة</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">اقرأ قبل ما تشتري</h1>
      <p className="mt-4 text-muted-foreground">
        مقالات عملية بالعربي. الدليل باللغة الإنجليزية، والسعر في صفحة المنتج بالدولار مع مقابل تقريبي بالريال. جميع
        المبيعات نهائية.
      </p>
      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-8">
            <p className="text-xs tracking-[0.16em] text-copper">{post.category}</p>
            <h2 className="mt-2 font-serif text-3xl">
              <Link href={postPath(post)} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Vellum Press · {new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(new Date(post.date))} ·{" "}
              {readingMinutes(post)} دقائق
            </p>
            <p className="mt-3 leading-relaxed">{post.description}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/blog" hrefLang="en" lang="en" className="underline underline-offset-4">
          English journal
        </Link>
      </p>
    </div>
  );
}
