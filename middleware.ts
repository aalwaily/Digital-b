import { LOCALE_COOKIE, LOCALE_HEADER, negotiateLocale, shouldSkipLocale } from "@/lib/i18n/config";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (shouldSkipLocale(pathname)) return NextResponse.next();

  const decision = negotiateLocale({
    pathname,
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    userAgent: request.headers.get("user-agent"),
  });

  if (decision.action === "next" || decision.action === "rewrite") {
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, decision.locale);
    const url = request.nextUrl.clone();
    if (decision.action === "rewrite") url.pathname = decision.pathname;
    const response =
      decision.action === "next"
        ? NextResponse.next({ request: { headers } })
        : NextResponse.rewrite(url, { request: { headers } });
    response.headers.set("Content-Language", decision.locale);
    response.headers.set("Vary", "Accept-Language, Cookie");
    // The bare URL has no /ar or /en prefix. Remember the rewrite so the
    // first paint can set dir before the header is parsed.
    if (pathname === "/" && !request.cookies.get(LOCALE_COOKIE)) {
      response.cookies.set(LOCALE_COOKIE, decision.locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
      });
    }
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = decision.pathname;
  url.search = search;
  const response = NextResponse.redirect(url, decision.status);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|samples|\\.well-known).*)"],
};
