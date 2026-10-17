import { isEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let email = "";
  let company = "";
  try {
    const body = (await request.json()) as { email?: unknown; company?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
    company = typeof body.company === "string" ? body.company : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (company) return NextResponse.json({ ok: true, delivered: false });
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ ok: true, delivered: false });
  const forwarded = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "newsletter", email }),
  });
  if (!forwarded.ok) {
    return NextResponse.json({ error: "The signup could not be delivered." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
