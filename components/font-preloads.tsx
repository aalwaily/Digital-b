import { fontHrefs } from "@/lib/font-preload";

export function FontPreloads({
  pick,
  preferBody = false,
}: {
  pick: (face: string) => boolean;
  /** Product pages paint body copy as the largest element. Home pages paint the heading. */
  preferBody?: boolean;
}) {
  return fontHrefs(pick).map(({ href, face }) => {
    const heading = /font-family:(?:Fraunces|Noto Naskh Arabic)/.test(face);
    const high = preferBody ? !heading : heading;
    return (
      <link
        key={href}
        rel="preload"
        href={href}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
        fetchPriority={high ? "high" : "low"}
      />
    );
  });
}
