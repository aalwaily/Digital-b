import { signingSecret } from "@/lib/download-token";
import { isPayPalOrderId, readPayPalCheckoutState } from "@/lib/paypal";
import { issuePayPalReceipt } from "@/lib/paypal-receipt";
import { isPayPalConfigured } from "@/lib/payments";
import { getRequestOrigin } from "@/lib/site-url";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectNoStore(url: string) {
  const response = NextResponse.redirect(url, 303);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = getRequestOrigin(request);
  const failed = () => redirectNoStore(`${origin}/checkout?paypal=failed`);

  if (!isPayPalConfigured()) return failed();

  const orderId = url.searchParams.get("token") ?? "";
  const stateToken = url.searchParams.get("state") ?? "";
  if (!isPayPalOrderId(orderId)) return failed();

  let secret: string;
  try {
    secret = signingSecret();
  } catch {
    return failed();
  }

  const state = readPayPalCheckoutState(stateToken, secret);
  if (!state) return failed();

  try {
    const result = await issuePayPalReceipt({
      orderId,
      email: state.email,
      slugs: state.slugs,
      secret,
    });
    if (!result.ok) {
      if (result.stage === "price") {
        console.error("PayPal return could not price the cart", result.reason);
      } else if (result.stage === "funds") {
        console.error("PayPal capture did not match the catalog quote", result.reason);
      } else {
        console.error("PayPal order refused", result.reason);
      }
      return failed();
    }
    return redirectNoStore(`${origin}/orders/${encodeURIComponent(result.token)}?paid=1`);
  } catch (error) {
    console.error("PayPal return failed", error instanceof Error ? error.message : "error");
    return failed();
  }
}
