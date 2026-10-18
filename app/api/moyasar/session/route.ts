import { parseCheckoutInput } from "@/lib/checkout-input";
import { signingSecret } from "@/lib/download-token";
import { buildMoyasarFormConfig, moyasarKeys, signMoyasarCheckoutState } from "@/lib/moyasar";
import { isMoyasarEnabled } from "@/lib/payments";
import { getRequestOrigin } from "@/lib/site-url";
import { site } from "@/data/site";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isMoyasarEnabled()) {
    return NextResponse.json({ error: "Moyasar is not configured." }, { status: 501 });
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

  try {
    const state = signMoyasarCheckoutState(
      { email, slugs: priced.lines.map((line) => line.slug) },
      secret,
    );
    const config = buildMoyasarFormConfig({
      publishableKey: moyasarKeys().publishable,
      email,
      priced,
      origin: getRequestOrigin(request),
      state,
      brandName: site.name,
    });
    return NextResponse.json(config);
  } catch (error) {
    console.error("Moyasar session failed", error instanceof Error ? error.message : "error");
    return NextResponse.json({ error: "Moyasar checkout could not be prepared." }, { status: 500 });
  }
}
