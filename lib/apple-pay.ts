const MAX_ASSOCIATION_BYTES = 64 * 1024;

export const APPLE_PAY_DOMAIN_ASSOCIATION_PATH = "/.well-known/apple-developer-merchantid-domain-association";

/**
 * Apple's domain check requires the raw association file as a binary response.
 * An HTML page or a redirect fails registration.
 */
export const APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE = "application/octet-stream";

export function readApplePayDomainAssociation(value: string | undefined | null) {
  if (typeof value !== "string") return null;
  const stripped = value.replace(/^\uFEFF/, "");
  if (!stripped.trim()) return null;
  if (new TextEncoder().encode(stripped).length > MAX_ASSOCIATION_BYTES) return null;
  return stripped;
}

export type ApplePayDomainFile = { ok: true; body: string } | { ok: false; reason: "missing" };

/** Serve Moyasar's Apple Pay domain file when that variable is set. */
export function resolveApplePayDomainAssociation(moyasarValue: string | undefined | null): ApplePayDomainFile {
  const body = readApplePayDomainAssociation(moyasarValue);
  if (!body) return { ok: false, reason: "missing" };
  return { ok: true, body };
}
