import { assessMoyasarPayment, fetchMoyasarPayment, isMoyasarConfigured, isMoyasarPaymentId } from "@/lib/moyasar";
import { signDownloadToken, signingSecret } from "@/lib/download-token";
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
  const failed = () => redirectNoStore(`${origin}/checkout?moyasar=failed`);

  if (!isMoyasarConfigured()) return failed();

  const paymentId = (url.searchParams.get("id") ?? "").toLowerCase();
  const stateToken = url.searchParams.get("state") ?? "";
  if (!isMoyasarPaymentId(paymentId)) return failed();

  let secret: string;
  try {
    secret = signingSecret();
  } catch {
    return failed();
  }

  try {
    const loaded = await fetchMoyasarPayment(paymentId);
    const assessed = assessMoyasarPayment({
      paymentId,
      stateToken,
      secret,
      origin,
      payment: loaded,
    });
    if (!assessed.ok) {
      console.error("Moyasar payment refused", assessed.reason);
      return failed();
    }

    const token = signDownloadToken({
      orderId: assessed.payment.id,
      email: assessed.email,
      items: assessed.priced.lines.map((line) => ({ slug: line.slug, title: line.title, price: line.price })),
      files: assessed.priced.files,
      demo: false,
      created: assessed.timing.created,
      exp: assessed.timing.exp,
    });
    return redirectNoStore(`${origin}/orders/${encodeURIComponent(token)}?paid=1`);
  } catch (error) {
    console.error("Moyasar callback failed", error instanceof Error ? error.message : "error");
    return failed();
  }
}
