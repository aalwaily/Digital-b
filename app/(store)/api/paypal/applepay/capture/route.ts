import { signingSecret } from "@/lib/download-token";
import { isPayPalOrderId, readPayPalCheckoutState } from "@/lib/paypal";
import { issuePayPalReceipt } from "@/lib/paypal-receipt";
import { isPayPalConfigured } from "@/lib/payments";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured." }, { status: 501 });
  }

  let orderId = "";
  let stateToken = "";
  try {
    const body = (await request.json()) as { orderId?: unknown; state?: unknown };
    orderId = typeof body.orderId === "string" ? body.orderId : "";
    stateToken = typeof body.state === "string" ? body.state : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isPayPalOrderId(orderId) || !stateToken) {
    return NextResponse.json({ error: "Apple Pay could not be confirmed." }, { status: 400 });
  }

  let secret: string;
  try {
    secret = signingSecret();
  } catch {
    return NextResponse.json({ error: "Download links are not configured." }, { status: 500 });
  }

  const state = readPayPalCheckoutState(stateToken, secret);
  if (!state) {
    return NextResponse.json({ error: "Apple Pay could not be confirmed." }, { status: 400 });
  }

  try {
    const result = await issuePayPalReceipt({
      orderId,
      email: state.email,
      slugs: state.slugs,
      secret,
    });
    if (!result.ok) {
      console.error("Apple Pay receipt refused", result.stage, result.reason);
      const status = result.stage === "price" ? 400 : 402;
      return NextResponse.json(
        { error: "Apple Pay could not be confirmed, so the downloads were not released." },
        { status },
      );
    }
    return NextResponse.json({ token: result.token });
  } catch (error) {
    console.error("Apple Pay capture failed", error instanceof Error ? error.message : "error");
    return NextResponse.json({ error: "Apple Pay could not be confirmed." }, { status: 502 });
  }
}
