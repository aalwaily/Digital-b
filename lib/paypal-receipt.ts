import { quote } from "@/lib/catalog";
import { signDownloadToken } from "@/lib/download-token";
import {
  capturePayPalOrder,
  getPayPalOrder,
  orderMatchesCheckout,
  paypalReceiptTiming,
  verifyCapturedPayment,
  type PayPalCheck,
  type PayPalOrder,
} from "@/lib/paypal";

export type PayPalReceiptFailure = Exclude<PayPalCheck, { ok: true }>["reason"] | "price" | "identity";

export type PayPalReceiptResult =
  | { ok: true; token: string }
  | { ok: false; stage: "price" | "order" | "funds"; reason: PayPalReceiptFailure };

async function settlePayPalOrder(orderId: string, loaded: PayPalOrder, expectedAmount: number) {
  if (loaded.status !== "APPROVED") return loaded;
  const captured = await capturePayPalOrder(orderId);
  if (verifyCapturedPayment(captured, expectedAmount).ok) return captured;
  return getPayPalOrder(orderId);
}

export async function issuePayPalReceipt(input: {
  orderId: string;
  email: string;
  slugs: string[];
  secret: string;
}): Promise<PayPalReceiptResult> {
  let priced;
  try {
    priced = quote(input.slugs);
  } catch {
    return { ok: false, stage: "price", reason: "price" };
  }

  const checkInput = {
    email: input.email,
    slugs: priced.lines.map((line) => line.slug),
    expectedAmount: priced.subtotal,
    secret: input.secret,
  };

  const loaded = await getPayPalOrder(input.orderId);
  if (loaded.id !== input.orderId) return { ok: false, stage: "order", reason: "identity" };

  const bound = orderMatchesCheckout(loaded, checkInput);
  if (!bound.ok) return { ok: false, stage: "order", reason: bound.reason };

  const settled = await settlePayPalOrder(input.orderId, loaded, priced.subtotal);
  if (settled.id && settled.id !== input.orderId) return { ok: false, stage: "order", reason: "identity" };

  const funds = verifyCapturedPayment(settled, priced.subtotal);
  if (!funds.ok) return { ok: false, stage: "funds", reason: funds.reason };

  const timing = paypalReceiptTiming(settled);
  const token = signDownloadToken({
    orderId: input.orderId,
    email: input.email,
    items: priced.lines.map((line) => ({ slug: line.slug, title: line.title, price: line.price })),
    files: priced.files,
    demo: false,
    created: timing.created,
    exp: timing.exp,
  });
  return { ok: true, token };
}
