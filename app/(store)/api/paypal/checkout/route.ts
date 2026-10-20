import { parseCheckoutInput } from "@/lib/checkout-input";
import { startPayPalHostedCheckout } from "@/lib/checkout-provider";
import { signingSecret } from "@/lib/download-token";
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

  let secret: string;
  try {
    secret = signingSecret();
  } catch {
    return NextResponse.json({ error: "Download links are not configured." }, { status: 500 });
  }

  const origin = getRequestOrigin(request);

  try {
    const result = await startPayPalHostedCheckout({
      email,
      priced,
      origin,
      brandName: site.name,
      secret,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("PayPal checkout failed", error instanceof Error ? error.message : "error");
    return NextResponse.json({ error: "PayPal checkout could not be started." }, { status: 502 });
  }
}
