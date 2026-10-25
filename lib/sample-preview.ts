/**
 * Interior page rendered from each free sample PDF (US Letter at 110 DPI).
 * The files live in public/previews and match public/samples/<slug>-sample.pdf page 2.
 */
export const SAMPLE_PREVIEW = { page: 2, width: 935, height: 1210 } as const;

export function samplePreviewSrc(slug: string) {
  return `/previews/${slug}.png`;
}
