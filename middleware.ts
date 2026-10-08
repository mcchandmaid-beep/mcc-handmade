import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookieName } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeSegment = pathname.split("/")[1];

  if (isLocale(localeSegment)) {
    const response = NextResponse.next();
    response.cookies.set(localeCookieName, localeSegment, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  const rememberedLocale = request.cookies.get(localeCookieName)?.value;
  const locale = isLocale(rememberedLocale) ? rememberedLocale : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
