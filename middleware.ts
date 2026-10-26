import {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  isLocale,
  isSearchBot,
  localeFromAcceptLanguage,
  localeFromPath,
  negotiateLocale,
  shouldSkipLocale,
} from "@/lib/i18n/config";
import { isNotFoundProbe, normalizePathname, notFoundPath, pageExists, unprefixedTarget } from "@/lib/routes";
import { NextResponse, type NextRequest } from "next/server";

function withLocaleHeaders(request: NextRequest, locale: "en" | "ar") {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  return headers;
}

function rewriteWithLocale(request: NextRequest, pathname: string, locale: "en" | "ar", setCookie: boolean) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.rewrite(url, { request: { headers: withLocaleHeaders(request, locale) } });
  response.headers.set("Content-Language", locale);
  response.headers.set("Vary", "Accept-Language, Cookie");
  if (setCookie && !request.cookies.get(LOCALE_COOKIE)) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
  }
  return response;
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url, 301);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (shouldSkipLocale(pathname)) return NextResponse.next();

  const normalized = normalizePathname(pathname);
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const acceptLanguage = request.headers.get("accept-language");
  const userAgent = request.headers.get("user-agent");
  const preferred = isLocale(cookie) ? cookie : localeFromAcceptLanguage(acceptLanguage);
  const bot = isSearchBot(userAgent);
  const requested = localeFromPath(normalized);

  if (requested) {
    if (isNotFoundProbe(normalized) || pageExists(normalized, requested)) {
      const headers = withLocaleHeaders(request, requested);
      const response = NextResponse.next({ request: { headers } });
      response.headers.set("Content-Language", requested);
      response.headers.set("Vary", "Accept-Language, Cookie");
      return response;
    }
    // A matched dynamic segment would otherwise render notFound() inside the
    // loading boundary and answer HTTP 200. Rewrite to an unmatched path so
    // the root not-found page is returned with a real 404.
    return rewriteWithLocale(request, notFoundPath(requested), requested, false);
  }

  if (normalized === "/") {
    const decision = negotiateLocale({ pathname: "/", cookie, acceptLanguage, userAgent });
    if (decision.action === "rewrite") {
      return rewriteWithLocale(request, decision.pathname, decision.locale, !cookie);
    }
  }

  const target = unprefixedTarget(normalized, bot ? "en" : preferred);
  if (!target) {
    const locale = bot ? "en" : preferred;
    return rewriteWithLocale(request, notFoundPath(locale), locale, !bot);
  }
  if (bot) return rewriteWithLocale(request, target.pathname, target.locale, false);
  return redirectTo(request, target.pathname);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|samples|\\.well-known).*)"],
};
