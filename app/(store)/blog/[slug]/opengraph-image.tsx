import { getPost } from "@/data/blog";
import { renderOgImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vellum Press journal article";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOgImage({
    eyebrow: "JOURNAL",
    title: post?.title ?? "Notes from the desk",
    deck: post?.description ?? "Practical notes from Vellum Press",
  });
}
