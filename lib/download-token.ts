import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type DownloadItem = {
  slug: string;
  title: string;
  price: number;
};

export type DownloadPayload = {
  v: 1;
  orderId: string;
  email: string;
  items: DownloadItem[];
  files: string[];
  exp: number;
  created: number;
  demo: boolean;
};

export function signingSecret() {
  const value = process.env.DOWNLOAD_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Set DOWNLOAD_SECRET to a random string of at least 16 characters.");
  }
  return "dev-only-vellum-download-secret";
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function newOrderId() {
  return `ord_${randomBytes(9).toString("base64url")}`;
}

export function downloadLinkDays() {
  const parsed = Number(process.env.DOWNLOAD_LINK_DAYS || 14);
  if (!Number.isFinite(parsed) || parsed < 1) return 14;
  return parsed;
}

export function signDownloadToken(
  input: Omit<DownloadPayload, "v" | "created" | "exp"> & { exp?: number; created?: number },
) {
  const now = Math.floor(Date.now() / 1000);
  const payload: DownloadPayload = {
    v: 1,
    orderId: input.orderId,
    email: input.email,
    items: input.items,
    files: input.files,
    demo: input.demo,
    created: input.created ?? now,
    exp: input.exp ?? now + downloadLinkDays() * 86400,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", signingSecret()).update(body).digest("base64url");
  return `${body}~${sig}`;
}

export function verifyDownloadToken(token: string): DownloadPayload | null {
  const separator = token.lastIndexOf("~");
  if (separator <= 0) return null;
  const body = token.slice(0, separator);
  const sig = token.slice(separator + 1);
  const expected = createHmac("sha256", signingSecret()).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as DownloadPayload;
    if (payload.v !== 1) return null;
    if (!payload.orderId || !payload.email || !Array.isArray(payload.files)) return null;
    if (!Number.isFinite(payload.exp) || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.files.every((file) => typeof file === "string")) return null;
    return payload;
  } catch {
    return null;
  }
}
