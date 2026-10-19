import { fetchMoyasarPayment, isMoyasarConfigured, parseMoyasarPayment, verifyMoyasarWebhook } from "@/lib/moyasar";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.MOYASAR_WEBHOOK_SECRET?.trim() ?? "";
  if (!secret || !isMoyasarConfigured()) {
    return NextResponse.json({ error: "Moyasar webhook is not configured." }, { status: 501 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const verified = verifyMoyasarWebhook(body, secret);
  if (!verified.ok) return NextResponse.json({ error: "Invalid webhook." }, { status: 400 });

  // Downloads are issued on /api/moyasar/callback only after the payment is fetched
  // and the paid amount matches the catalog. This endpoint acknowledges Moyasar.
  if (verified.type === "payment_paid" && verified.paymentId) {
    try {
      const payment = parseMoyasarPayment(await fetchMoyasarPayment(verified.paymentId));
      if (!payment || payment.status !== "paid" || payment.id !== verified.paymentId) {
        return NextResponse.json({ error: "Payment is not paid." }, { status: 409 });
      }
    } catch (error) {
      console.error("Moyasar webhook lookup failed", error instanceof Error ? error.message : "error");
      return NextResponse.json({ error: "Moyasar webhook could not be verified." }, { status: 502 });
    }
  }

  return NextResponse.json({ received: true });
}
