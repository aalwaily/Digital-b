import { CatalogError, quote, type Quote } from "@/lib/catalog";
import { isEmail } from "@/lib/email";

export type CheckoutInput = {
  email: string;
  priced: Quote;
  confirmDemo: boolean;
};

export function parseCheckoutInput(
  body: unknown,
): { ok: true; value: CheckoutInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request." };
  // `price`, `amount`, and `unit_amount` are ignored. The catalog prices the order.
  const record = body as { slugs?: unknown; email?: unknown; confirmDemo?: unknown };
  if (!Array.isArray(record.slugs) || record.slugs.some((slug) => typeof slug !== "string")) {
    return { ok: false, error: "Choose at least one guide." };
  }
  const email = typeof record.email === "string" ? record.email.trim() : "";
  if (!isEmail(email)) return { ok: false, error: "Enter a valid email address." };
  try {
    return {
      ok: true,
      value: {
        email,
        priced: quote(record.slugs),
        confirmDemo: record.confirmDemo === true,
      },
    };
  } catch (error) {
    const message = error instanceof CatalogError ? error.message : "Could not price this order.";
    return { ok: false, error: message };
  }
}
