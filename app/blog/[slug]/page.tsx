import { posts, getPost } from "@/data/blog";
import { getProduct } from "@/data/products";
import { LinkButton } from "@/components/link-button";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Journal" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = post.relatedProduct ? getProduct(post.relatedProduct) : undefined;

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(post.date))} · {post.readingMinutes} min read
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
              <ul key={index} className="list-disc space-y-2 pl-5">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }
          if (block.type === "tip") {
            return (
              <p key={index} className="border-l-2 border-copper pl-4 text-base">
                {block.text}
              </p>
            );
          }
          return <p key={index}>{block.text}</p>;
        })}
      </div>
      {related ? (
        <aside className="mt-12 rounded-2xl border bg-card p-5">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">The guide</p>
          <h2 className="mt-2 font-serif text-2xl">{related.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{related.shortDescription}</p>
          <LinkButton href={`/product/${related.slug}`} className="mt-4 h-10 px-4">
            View {related.title}
          </LinkButton>
        </aside>
      ) : null}
    </article>
  );
}
