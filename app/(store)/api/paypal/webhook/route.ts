import { PayPalRequestError, verifyPayPalWebhookSignature } from "@/lib/paypal";
import { isPayPalConfigured } from "@/lib/payments";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!process.env.PAYPAL_WEBHOOK_ID?.trim() || !isPayPalConfigured()) {
    return NextResponse.json({ error: "PayPal webhook is not configured." }, { status: 501 });
  }

  let event: unknown;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    const verified = await verifyPayPalWebhookSignature(request.headers, event);
    if (!verified) return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    // Downloads are issued on /api/paypal/return only after capture is verified.
    // This endpoint acknowledges PayPal. It does not release files.
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook rejected", error instanceof Error ? error.message : "error");
    const status = error instanceof PayPalRequestError && error.status === 501 ? 501 : 502;
    return NextResponse.json({ error: "PayPal webhook could not be verified." }, { status });
  }
}
