export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "vellum_locale";

export const LOCALE_HEADER = "x-locale";

const PUBLIC_FILE = /\.[a-z0-9]+$/i;

const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|facebot|whatsapp|telegram|embedly|quora|pinterest|redditbot|google|bingbot|bingpreview|yandex|baidu|duckduck|applebot|semrush|ahrefs|lighthouse|pagespeed|headlesschrome|wget|curl|preview|skypeuripreview|slackbot|discordbot|linkedinbot|embedly|vkshare|w3c_validator|qwantify|petalbot/i;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ar";
}

export function dirFor(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function htmlLang(locale: Locale) {
  return locale === "ar" ? "ar" : "en";
}

export function localePath(locale: Locale, path: string) {
  const [pathname, query] = path.split("?");
  const hashIndex = pathname.indexOf("#");
  const bare = hashIndex >= 0 ? pathname.slice(0, hashIndex) : pathname;
  const hash = hashIndex >= 0 ? pathname.slice(hashIndex) : "";
  const normalized = bare.startsWith("/") ? bare : `/${bare}`;
  const stripped = stripLocale(normalized);
  const next = stripped === "/" ? `/${locale}` : `/${locale}${stripped}`;
  const search = query ? `?${query}` : "";
  return `${next}${search}${hash}`;
}

export function stripLocale(pathname: string) {
  const parts = pathname.split("/");
  if (parts[1] === "en" || parts[1] === "ar") {
    const rest = parts.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

export function localeFromPath(pathname: string): Locale | null {
  const first = pathname.split("/")[1];
  return isLocale(first) ? first : null;
}

export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tagRaw, ...params] = part.trim().split(";");
      const qParam = params.map((item) => item.trim()).find((item) => item.startsWith("q="));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { tag: tagRaw.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((part) => part.tag && part.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const part of ranked) {
    if (part.tag === "ar" || part.tag.startsWith("ar-")) return "ar";
    if (part.tag === "en" || part.tag.startsWith("en-") || part.tag === "*") return "en";
  }
  return defaultLocale;
}

export function isSearchBot(userAgent: string | null | undefined) {
  if (!userAgent) return false;
  return BOT_UA.test(userAgent);
}

export function shouldSkipLocale(pathname: string) {
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/.well-known")) return true;
  if (pathname.startsWith("/samples")) return true;
  if (PUBLIC_FILE.test(pathname)) return true;
  return false;
}

export type Negotiation =
  | { action: "next"; locale: Locale }
  | { action: "rewrite"; locale: Locale; pathname: string }
  | { action: "redirect"; locale: Locale; pathname: string; status: 301 | 307 };

export function negotiateLocale(input: {
  pathname: string;
  cookie: string | null | undefined;
  acceptLanguage: string | null | undefined;
  userAgent: string | null | undefined;
}): Negotiation {
  const requested = localeFromPath(input.pathname);
  if (requested) return { action: "next", locale: requested };

  const preferred: Locale = isLocale(input.cookie)
    ? input.cookie
    : localeFromAcceptLanguage(input.acceptLanguage);
  const target = input.pathname === "/" ? `/${preferred}` : `/${preferred}${input.pathname}`;

  if (isSearchBot(input.userAgent)) {
    const english = input.pathname === "/" ? "/en" : `/en${input.pathname}`;
    return { action: "rewrite", locale: "en", pathname: english };
  }

  return {
    action: "redirect",
    locale: preferred,
    pathname: target,
    status: input.pathname === "/" ? 307 : 301,
  };
}

export function localeCookieValue(locale: Locale, secure: boolean) {
  const secureFlag = secure ? "; Secure" : "";
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secureFlag}`;
}
