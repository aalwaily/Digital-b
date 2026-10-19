import { parseCheckoutInput } from "@/lib/checkout-input";
import { signingSecret } from "@/lib/download-token";
import { buildApplePayOrderBody, createPayPalOrder, paypalOrderBinding, signPayPalCheckoutState } from "@/lib/paypal";
import { isPayPalConfigured } from "@/lib/payments";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured." }, { status: 501 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseCheckoutInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { email, priced } = parsed.value;
  const slugs = priced.lines.map((line) => line.slug);

  let secret: string;
  try {
    secret = signingSecret();
  } catch {
    return NextResponse.json({ error: "Download links are not configured." }, { status: 500 });
  }

  // The browser may send an amount. It is not read. The order uses the catalog quote.
  const orderBody = buildApplePayOrderBody({
    lines: priced.lines,
    subtotal: priced.subtotal,
    customId: paypalOrderBinding(email, slugs, secret),
  });

  try {
    const order = await createPayPalOrder(orderBody);
    if (!order.id) {
      return NextResponse.json({ error: "PayPal did not return an order." }, { status: 502 });
    }
    const state = signPayPalCheckoutState({ email, slugs }, secret);
    return NextResponse.json({ id: order.id, state });
  } catch (error) {
    console.error("Apple Pay order creation failed", error instanceof Error ? error.message : "error");
    return NextResponse.json({ error: "Apple Pay could not be started." }, { status: 502 });
  }
}
