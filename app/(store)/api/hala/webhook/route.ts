import { paymentProvider } from "@/lib/checkout-provider";
import { deliverPaidHalaOrder, markHalaOrderPaid, parseHalaWebhook, verifyHalaSignature, HALA_SIGNATURE_HEADER } from "@/lib/hala";
import { localePath } from "@/lib/i18n/config";
import { getRequestOrigin } from "@/lib/site-url";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hala webhook stub.
 * Verifies the signature, then marks the order paid, and only then issues the
 * PDF download link. A bad signature or an unpaid status never returns a link.
 *
 * TODO: Point Hala's dashboard at POST /api/hala/webhook and confirm the
 * signature header once they publish docs. HALA_WEBHOOK_SECRET is the HMAC key.
 */
export async function POST(request: Request) {
  if (paymentProvider() !== "hala") {
    return NextResponse.json({ error: "Hala is not the active payment provider." }, { status: 404 });
  }

  const secret = process.env.HALA_WEBHOOK_SECRET?.trim() ?? "";
  if (!secret) {
    return NextResponse.json({ error: "Hala webhook is not configured." }, { status: 501 });
  }

  const raw = await request.text();
  if (!verifyHalaSignature(raw, request.headers.get(HALA_SIGNATURE_HEADER), secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = parseHalaWebhook(raw);
  if (!event) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  const marked = markHalaOrderPaid(event);
  if (!marked.paid) {
    return NextResponse.json({ received: true, paid: false });
  }

  const token = deliverPaidHalaOrder(marked);
  const origin = getRequestOrigin(request);
  return NextResponse.json({
    received: true,
    paid: true,
    orderId: marked.id,
    downloadUrl: `${origin}${localePath("en", `/orders/${encodeURIComponent(token)}`)}`,
  });
}
