import { getLegalPage, legalPages } from "@/data/legal";
import { staticSeo } from "@/data/page-seo";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return { title: "Legal" };
  const seo = staticSeo[page.slug as keyof typeof staticSeo];
  return pageMetadata({
    title: seo && "title" in seo ? seo.title : page.title,
    description: seo && "description" in seo ? seo.description : page.description,
    path: `/legal/${page.slug}`,
  });
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Legal</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{page.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Updated {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(page.updated))}
      </p>
      <div className="mt-8 space-y-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-2xl">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-[1.02rem] leading-relaxed">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
