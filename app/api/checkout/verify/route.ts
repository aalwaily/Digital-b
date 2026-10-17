import { CatalogError, quote } from "@/lib/catalog";
import { downloadLinkDays, signDownloadToken } from "@/lib/download-token";
import { getStripe } from "@/lib/payments";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 501 });
  }

  let sessionId = "";
  try {
    const body = (await request.json()) as { sessionId?: unknown };
    sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  } catch {
    sessionId = "";
  }
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing checkout session." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment is not complete yet." }, { status: 402 });
    }
    const slugs = (session.metadata?.slugs ?? "")
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean);
    const priced = quote(slugs);
    const email = session.customer_details?.email || session.customer_email || session.metadata?.email || "";
    const token = signDownloadToken({
      orderId: session.id,
      email,
      items: priced.lines.map((line) => ({ slug: line.slug, title: line.title, price: line.price })),
      files: priced.files,
      demo: false,
      created: session.created,
      exp: session.created + downloadLinkDays() * 86400,
    });
    return NextResponse.json({ token, slugs: priced.lines.map((line) => line.slug) });
  } catch (error) {
    if (error instanceof CatalogError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Stripe verify failed", error);
    return NextResponse.json({ error: "Could not verify this payment." }, { status: 502 });
  }
}
