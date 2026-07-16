import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authjs.session-token") ?? 
                req.cookies.get("__Secure-authjs.session-token");

  const isProtected = ["/feed", "/profile", "/messages", "/notifications"].some(
    (route) => req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed", "/profile", "/messages", "/notifications"],
};

