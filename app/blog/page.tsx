import { posts } from "@/data/blog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on meal prep, budgeting, studying, and starting a side hustle beside a job.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Journal</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">Notes from the desk</h1>
      <p className="mt-4 text-muted-foreground">
        Short articles that stand on their own. The guides go further, with worksheets.
      </p>
      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-8">
            <p className="text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
            <h2 className="mt-2 font-serif text-3xl">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(post.date))} · {post.readingMinutes} min read
            </p>
            <p className="mt-3 leading-relaxed">{post.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
