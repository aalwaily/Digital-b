const LIVE_SDK = "https://www.paypal.com/sdk/js";
const SANDBOX_SDK = "https://www.sandbox.paypal.com/sdk/js";
const APPLE_PAY_JS_SDK = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";

const MAX_ASSOCIATION_BYTES = 64 * 1024;

export const APPLE_PAY_DOMAIN_ASSOCIATION_PATH = "/.well-known/apple-developer-merchantid-domain-association";

/**
 * PayPal's domain check (updated October 2026) requires the raw association
 * file as a binary response. An HTML page or a redirect fails registration.
 */
export const APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE = "application/octet-stream";

export function applePayJsSdkUrl() {
  return APPLE_PAY_JS_SDK;
}

export function paypalEnvironment(value: string | undefined): "sandbox" | "live" {
  return value === "live" ? "live" : "sandbox";
}

export function paypalApplePaySdkUrl(clientId: string, environment: "sandbox" | "live") {
  const id = clientId.trim();
  if (!id) throw new Error("PayPal client id is missing.");
  const params = new URLSearchParams({
    "client-id": id,
    components: "applepay",
    currency: "USD",
    intent: "capture",
  });
  if (environment !== "live") params.set("buyer-country", "US");
  const base = environment === "live" ? LIVE_SDK : SANDBOX_SDK;
  return `${base}?${params.toString()}`;
}

export function applePayBrowserConfig(clientId: string, paypalEnv: string | undefined) {
  const id = clientId.trim();
  if (!id) return null;
  const environment = paypalEnvironment(paypalEnv);
  return {
    clientId: id,
    environment,
    sdkUrl: paypalApplePaySdkUrl(id, environment),
  };
}

const SDK_HOSTS = new Set(["www.paypal.com", "www.sandbox.paypal.com"]);

export function isPayPalApplePaySdkUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (!SDK_HOSTS.has(url.hostname)) return false;
    if (url.pathname !== "/sdk/js") return false;
    if (url.searchParams.get("components") !== "applepay") return false;
    if (!url.searchParams.get("client-id")) return false;
    if (url.searchParams.get("currency") !== "USD") return false;
    if (url.searchParams.get("intent") !== "capture") return false;
    const buyerCountry = url.searchParams.get("buyer-country");
    if (url.hostname === "www.paypal.com" && buyerCountry) return false;
    if (url.hostname === "www.sandbox.paypal.com" && buyerCountry !== "US") return false;
    return true;
  } catch {
    return false;
  }
}

export type ApplePayEligibility = {
  hasApplePaySession: boolean;
  canMakePayments: boolean;
  isEligible: boolean;
};

export function shouldShowApplePayButton(input: ApplePayEligibility) {
  return input.hasApplePaySession && input.canMakePayments && input.isEligible;
}

export function formatApplePayAmount(amount: number) {
  if (!Number.isFinite(amount)) return null;
  const cents = Math.round(amount * 100);
  if (!Number.isSafeInteger(cents) || cents <= 0) return null;
  const whole = Math.trunc(cents / 100);
  const fraction = String(cents % 100).padStart(2, "0");
  return `${whole}.${fraction}`;
}

export function applePaySheetTotal(input: { label: string; amount: number }) {
  const amount = formatApplePayAmount(input.amount);
  if (!amount) return null;
  return { label: input.label.slice(0, 64) || "Vellum Press", amount, type: "final" as const };
}

export function readApplePayDomainAssociation(value: string | undefined | null) {
  if (typeof value !== "string") return null;
  const stripped = value.replace(/^\uFEFF/, "");
  if (!stripped.trim()) return null;
  if (new TextEncoder().encode(stripped).length > MAX_ASSOCIATION_BYTES) return null;
  return stripped;
}
