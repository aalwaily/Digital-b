import { fontHrefs } from "@/lib/font-preload";

export function FontPreloads({ pick }: { pick: (face: string) => boolean }) {
  return fontHrefs(pick).map((href) => (
    <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
  ));
}
