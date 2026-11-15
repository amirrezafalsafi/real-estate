import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";
import { USER_COOKIE_NAME, verifyUserToken } from "@/lib/user-auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminToken(token) : null;

    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage) {
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/panel")) {
    const token = request.cookies.get(USER_COOKIE_NAME)?.value;
    const session = token ? await verifyUserToken(token) : null;

    if (!session) {
      const redirectTarget = pathname === "/panel" ? "/panel" : pathname;
      const loginUrl = new URL(`/auth/login?redirect=${encodeURIComponent(redirectTarget)}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    const token = request.cookies.get(USER_COOKIE_NAME)?.value;
    const session = token ? await verifyUserToken(token) : null;

    if (session) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/panel",
    "/panel/:path*",
    "/auth/login",
    "/auth/signup",
  ],
};
