import { parseCheckoutInput } from "@/lib/checkout-input";
import { signingSecret } from "@/lib/download-token";
import {
  approveUrlFromOrder,
  buildPayPalOrderBody,
  createPayPalOrder,
  paypalOrderBinding,
  signPayPalCheckoutState,
} from "@/lib/paypal";
import { isPayPalConfigured } from "@/lib/payments";
import { getRequestOrigin } from "@/lib/site-url";
import { site } from "@/data/site";
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

  const origin = getRequestOrigin(request);
  const state = signPayPalCheckoutState({ email, slugs }, secret);
  const orderBody = buildPayPalOrderBody({
    lines: priced.lines,
    subtotal: priced.subtotal,
    customId: paypalOrderBinding(email, slugs, secret),
    returnUrl: `${origin}/api/paypal/return?state=${encodeURIComponent(state)}`,
    cancelUrl: `${origin}/cart?canceled=1`,
    brandName: site.name,
  });

  try {
    const order = await createPayPalOrder(orderBody);
    const url = approveUrlFromOrder(order);
    if (!url) {
      return NextResponse.json({ error: "PayPal did not return an approval link." }, { status: 502 });
    }
    return NextResponse.json({ url });
  } catch (error) {
    console.error("PayPal checkout failed", error instanceof Error ? error.message : "error");
    return NextResponse.json({ error: "PayPal checkout could not be started." }, { status: 502 });
  }
}
