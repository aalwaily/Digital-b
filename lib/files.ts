import { isSlug } from "@/lib/catalog";
import fs from "node:fs";
import path from "node:path";

export function privatePdfPath(slug: string) {
  if (!isSlug(slug)) return null;
  const root = path.resolve(process.cwd(), "private", "pdfs");
  const file = path.resolve(root, `${slug}.pdf`);
  if (!file.startsWith(`${root}${path.sep}`)) return null;
  if (!fs.existsSync(file)) return null;
  return file;
}

export function samplePdfPath(slug: string) {
  if (!isSlug(slug)) return null;
  return path.join(process.cwd(), "public", "samples", `${slug}-sample.pdf`);
}
