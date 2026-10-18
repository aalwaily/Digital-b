import { applePayBrowserConfig } from "@/lib/apple-pay";
import { isPayPalConfigured } from "@/lib/payments";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured." }, { status: 404 });
  }
  const config = applePayBrowserConfig(process.env.PAYPAL_CLIENT_ID ?? "", process.env.PAYPAL_ENV);
  if (!config) {
    return NextResponse.json({ error: "PayPal is not configured." }, { status: 404 });
  }
  return NextResponse.json(config);
}
