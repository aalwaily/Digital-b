export type LeadRecord = {
  type: "newsletter" | "sample";
  email: string;
  slug?: string;
  titles?: string[];
};

export type LeadResult =
  | { ok: true; stored: "log" | "webhook" }
  | { ok: false; error: string };

/** Forward a signup when NEWSLETTER_WEBHOOK_URL is set. Otherwise write it to the server log. */
export async function recordLead(lead: LeadRecord): Promise<LeadResult> {
  const webhook = process.env.NEWSLETTER_WEBHOOK_URL?.trim();
  if (!webhook) {
    console.info(
      JSON.stringify({
        ...lead,
        stored: "log",
        at: new Date().toISOString(),
      }),
    );
    return { ok: true, stored: "log" };
  }

  try {
    const forwarded = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...lead, at: new Date().toISOString() }),
    });
    if (!forwarded.ok) {
      return { ok: false, error: "The signup could not be delivered." };
    }
  } catch {
    return { ok: false, error: "The signup could not be delivered." };
  }
  return { ok: true, stored: "webhook" };
}
