import { orderedPosts, postPath } from "@/data/blog";
import { staticSeo } from "@/data/page-seo";
import { pageMetadata } from "@/lib/page-meta";
import { readingMinutes } from "@/lib/reading";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: staticSeo.blog.title,
  description: staticSeo.blog.description,
  path: "/blog",
  enPath: "/blog",
  arPath: "/ar/blog",
});

export default function BlogPage() {
  const english = orderedPosts("en");
  const arabic = orderedPosts("ar");
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Journal</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">Notes before you buy</h1>
      <p className="mt-4 text-muted-foreground">
        Practical articles that stand on their own, each pointing at the PDF it belongs with. Prices are on the product
        pages. All sales are final.
      </p>
      <div className="mt-10 space-y-8">
        {english.map((post) => (
          <article key={post.slug} className="border-b pb-8">
            <p className="text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
            <h2 className="mt-2 font-serif text-3xl">
              <Link href={postPath(post)} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Vellum Press · {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(post.date))} ·{" "}
              {readingMinutes(post)} min read
            </p>
            <p className="mt-3 leading-relaxed">{post.description}</p>
          </article>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="font-serif text-3xl" lang="ar">
          بالعربية
        </h2>
        <ul className="mt-4 space-y-3">
          {arabic.map((post) => (
            <li key={post.slug}>
              <Link href={postPath(post)} hrefLang="ar" lang="ar" className="underline underline-offset-4">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
