import type { Metadata } from "next";

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  index?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const image = input.path === "/" ? "/opengraph-image" : `${input.path}/opengraph-image`;
  const images = input.index === false ? undefined : [{ url: image, width: 1200, height: 630, alt: input.title }];
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    robots: input.index === false ? { index: false, follow: false } : undefined,
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      type: input.type ?? "website",
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      ...(images ? { images: [image] } : {}),
    },
  };
}
