import { NextRequest, NextResponse } from "next/server";
import { isRoleAllowed } from "@/config/permissions";
import { ACCESS_TOKEN_KEY, USER_ROLE_KEY } from "@/constants/auth";

// Routes that skip ALL middleware checks
const PUBLIC_ROUTES = [
  "/login",
  "/verify-email",
  "/forgot-password",
  "/unauthorized",
];

// Routes that redirect authenticated users away (e.g. login only)
const AUTH_ONLY_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const role = request.cookies.get(USER_ROLE_KEY)?.value ?? "";

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthOnly = AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r));

  // ── 1. Redirect authenticated users away from login/verify pages ───────────
  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── 2. Redirect unauthenticated users to login ─────────────────────────────
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Role-based access check (authenticated users only) ──────────────────
  if (token && !isPublic) {
    const allowed = isRoleAllowed(pathname, role);
    if (!allowed) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
