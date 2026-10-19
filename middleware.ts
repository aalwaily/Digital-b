import { LOCALE_HEADER, negotiateLocale, shouldSkipLocale } from "@/lib/i18n/config";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (shouldSkipLocale(pathname)) return NextResponse.next();

  const decision = negotiateLocale({
    pathname,
    cookie: request.cookies.get("vellum_locale")?.value,
    acceptLanguage: request.headers.get("accept-language"),
    userAgent: request.headers.get("user-agent"),
  });

  if (decision.action === "next" || decision.action === "rewrite") {
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, decision.locale);
    if (decision.action === "next") {
      const response = NextResponse.next({ request: { headers } });
      response.headers.set("Content-Language", decision.locale);
      response.headers.set("Vary", "Accept-Language, Cookie");
      return response;
    }
    const url = request.nextUrl.clone();
    url.pathname = decision.pathname;
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.headers.set("Content-Language", decision.locale);
    response.headers.set("Vary", "Accept-Language, Cookie");
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
