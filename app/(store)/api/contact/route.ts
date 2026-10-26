import { isEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let name = "";
  let email = "";
  let topic = "";
  let message = "";
  let company = "";
  try {
    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      topic?: unknown;
      message?: unknown;
      company?: unknown;
    };
    name = typeof body.name === "string" ? body.name.trim() : "";
    email = typeof body.email === "string" ? body.email.trim() : "";
    topic = typeof body.topic === "string" ? body.topic.trim() : "";
    message = typeof body.message === "string" ? body.message.trim() : "";
    company = typeof body.company === "string" ? body.company : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (company) return NextResponse.json({ ok: true, delivered: false });
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Add your name." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (topic.length < 2 || topic.length > 80) {
    return NextResponse.json({ error: "Choose a topic." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: "Please write at least a sentence." }, { status: 400 });
  }
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ ok: true, delivered: false });
  const forwarded = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "contact", name, email, topic, message }),
  });
  if (!forwarded.ok) {
    return NextResponse.json({ error: "We could not send your message." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
