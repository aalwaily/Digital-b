import { isEmail } from "@/lib/email";
import { recordLead } from "@/lib/leads";
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
  if (company) return NextResponse.json({ ok: true, stored: "ignored" });
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const recorded = await recordLead({ type: "newsletter", email });
  if (!recorded.ok) {
    return NextResponse.json({ error: recorded.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, stored: recorded.stored });
}
