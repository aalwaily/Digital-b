import { getProduct, isBundle } from "@/data/products";
import { isEmail } from "@/lib/email";
import { samplePageCount } from "@/lib/catalog";
import { samplePdfPath } from "@/lib/files";
import { recordLead } from "@/lib/leads";
import fs from "node:fs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SampleDownload = {
  slug: string;
  title: string;
  href: string;
  pages: number | null;
};

function samplesFor(slug: string): SampleDownload[] | null {
  const product = getProduct(slug);
  if (!product) return null;
  const slugs = isBundle(product) ? product.includes : [product.slug];
  const downloads: SampleDownload[] = [];
  for (const sampleSlug of slugs) {
    const guide = getProduct(sampleSlug);
    const file = samplePdfPath(sampleSlug);
    if (!guide || isBundle(guide) || !file || !fs.existsSync(file)) return null;
    downloads.push({
      slug: sampleSlug,
      title: guide.title,
      href: `/samples/${sampleSlug}-sample.pdf`,
      pages: samplePageCount(sampleSlug),
    });
  }
  return downloads.length ? downloads : null;
}

export async function POST(request: Request) {
  let email = "";
  let slug = "";
  let company = "";
  try {
    const body = (await request.json()) as { email?: unknown; slug?: unknown; company?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
    slug = typeof body.slug === "string" ? body.slug.trim() : "";
    company = typeof body.company === "string" ? body.company : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (company) return NextResponse.json({ ok: true, stored: "ignored", downloads: [] });
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const downloads = samplesFor(slug);
  if (!downloads) {
    return NextResponse.json({ error: "That sample is not available." }, { status: 404 });
  }
  const recorded = await recordLead({
    type: "sample",
    email,
    slug,
    titles: downloads.map((item) => item.title),
  });
  if (!recorded.ok) {
    return NextResponse.json({ error: recorded.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, stored: recorded.stored, downloads });
}
