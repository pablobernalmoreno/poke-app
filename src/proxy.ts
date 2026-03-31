import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/locales";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, LOCALES as unknown as string[], DEFAULT_LOCALE);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip if pathname already starts with a supported locale
  const pathnameHasLocale = LOCALES.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) return;

  // Redirect to the preferred locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip _next, api, static files, and favicons
    "/((?!_next|api|favicon.ico).*)",
  ],
};
