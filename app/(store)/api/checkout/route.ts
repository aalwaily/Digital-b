import { parseCheckoutInput } from "@/lib/checkout-input";
import { signDownloadToken, newOrderId } from "@/lib/download-token";
import { demoCheckoutAllowed, getStripe, isStripeEnabled } from "@/lib/payments";
import { getRequestOrigin } from "@/lib/site-url";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseCheckoutInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { email, priced, confirmDemo } = parsed.value;

  if (!isStripeEnabled()) {
    if (!demoCheckoutAllowed()) {
      return NextResponse.json({ error: "Card checkout is not available." }, { status: 400 });
    }
    if (!confirmDemo) {
      return NextResponse.json(
        { demo: true, error: "Demo checkout has to be confirmed on the checkout page." },
        { status: 400 },
      );
    }
    const token = signDownloadToken({
      orderId: newOrderId(),
      email,
      items: priced.lines.map((line) => ({ slug: line.slug, title: line.title, price: line.price })),
      files: priced.files,
      demo: true,
    });
    return NextResponse.json({ demo: true, token });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Card checkout is not available." }, { status: 400 });
  }

  const origin = getRequestOrigin(request);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
      metadata: {
        slugs: priced.lines.map((line) => line.slug).join(","),
        email,
      },
      line_items: priced.lines.map((line) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(line.price * 100),
          product_data: {
            name: line.title,
            description: "Digital PDF from Vellum Press",
          },
        },
      })),
    });
    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout failed", error);
    return NextResponse.json(
      { error: "Payment could not be started. Check the Stripe configuration." },
      { status: 502 },
    );
  }
}
