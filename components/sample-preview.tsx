import { SAMPLE_PREVIEW } from "@/lib/sample-preview";
import Image from "next/image";

export function SamplePreview({
  slides,
  className = "",
}: {
  slides: { slug: string; src: string; alt: string; caption: string }[];
  className?: string;
}) {
  if (!slides.length) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {slides.map((slide) => (
        <figure key={slide.slug} className="mx-auto w-full max-w-[22rem] lg:max-w-none">
          <Image
            src={slide.src}
            alt={slide.alt}
            width={SAMPLE_PREVIEW.width}
            height={SAMPLE_PREVIEW.height}
            sizes="(min-width: 1024px) 36rem, 22rem"
            fetchPriority="low"
            className="h-auto w-full rounded-xl bg-white ring-1 ring-black/10 dark:ring-white/15"
          />
          <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">{slide.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
