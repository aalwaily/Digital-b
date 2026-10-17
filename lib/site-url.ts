export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:43123";
  return raw.replace(/\/$/, "");
}

export function getRequestOrigin(request: Request) {
  if (process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV === "production") {
    return getSiteUrl();
  }
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (!host) return getSiteUrl();
  return `${proto}://${host}`;
}
