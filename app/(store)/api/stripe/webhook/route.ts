import { getStripe } from "@/lib/payments";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 501 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }
  const payload = await request.text();
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    if (event.type === "checkout.session.completed") {
      // The buyer already receives files when /checkout/success verifies the session.
      // Use this event later if you email downloads from a worker.
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook rejected", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }
}
