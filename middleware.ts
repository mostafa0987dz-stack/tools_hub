import { NextRequest, NextResponse } from "next/server";

const locales = ["ar", "en"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  const accept = req.headers.get("accept-language")?.toLowerCase() ?? "";
  const locale = cookie && locales.includes(cookie) ? cookie : accept.startsWith("en") ? "en" : "ar";
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
