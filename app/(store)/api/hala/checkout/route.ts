import { parseCheckoutInput } from "@/lib/checkout-input";
import { PAYMENT_UNAVAILABLE_ERROR, paymentProvider } from "@/lib/checkout-provider";
import { startHalaHostedCheckout } from "@/lib/hala";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Placeholder for a Hala hosted checkout.
 * TODO: When Hala publishes an API, startHalaHostedCheckout should return the
 * hosted URL. Until then this route does not charge anyone.
 */
export async function POST(request: Request) {
  if (paymentProvider() !== "hala") {
    return NextResponse.json({ error: PAYMENT_UNAVAILABLE_ERROR }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseCheckoutInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const result = startHalaHostedCheckout({ email: parsed.value.email, priced: parsed.value.priced });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ url: result.url });
}
