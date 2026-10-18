import { quote } from "@/lib/catalog";
import { signDownloadToken, signingSecret } from "@/lib/download-token";
import {
  capturePayPalOrder,
  getPayPalOrder,
  isPayPalOrderId,
  orderMatchesCheckout,
  paypalReceiptTiming,
  readPayPalCheckoutState,
  verifyCapturedPayment,
  type PayPalOrder,
} from "@/lib/paypal";
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

async function settleOrder(orderId: string, loaded: PayPalOrder, expectedAmount: number) {
  if (loaded.status !== "APPROVED") return loaded;
  const captured = await capturePayPalOrder(orderId);
  if (verifyCapturedPayment(captured, expectedAmount).ok) return captured;
  return getPayPalOrder(orderId);
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

  let priced;
  try {
    priced = quote(state.slugs);
  } catch (error) {
    console.error("PayPal return could not price the cart", error instanceof Error ? error.message : "error");
    return failed();
  }

  const checkInput = {
    email: state.email,
    slugs: priced.lines.map((line) => line.slug),
    expectedAmount: priced.subtotal,
    secret,
  };

  try {
    const loaded = await getPayPalOrder(orderId);
    if (loaded.id !== orderId) return failed();

    // Refuse before capture when this PayPal order is not the signed cart,
    // or when its amount is not the catalog price. An approved order is not
    // enough to release files.
    const bound = orderMatchesCheckout(loaded, checkInput);
    if (!bound.ok) {
      console.error("PayPal order refused", bound.reason);
      return failed();
    }

    const settled = await settleOrder(orderId, loaded, priced.subtotal);
    if (settled.id && settled.id !== orderId) return failed();

    const funds = verifyCapturedPayment(settled, priced.subtotal);
    if (!funds.ok) {
      console.error("PayPal capture did not match the catalog quote", funds.reason);
      return failed();
    }

    const timing = paypalReceiptTiming(settled);
    const token = signDownloadToken({
      orderId,
      email: state.email,
      items: priced.lines.map((line) => ({ slug: line.slug, title: line.title, price: line.price })),
      files: priced.files,
      demo: false,
      created: timing.created,
      exp: timing.exp,
    });
    return redirectNoStore(`${origin}/orders/${encodeURIComponent(token)}?paid=1`);
  } catch (error) {
    console.error("PayPal return failed", error instanceof Error ? error.message : "error");
    return failed();
  }
}
