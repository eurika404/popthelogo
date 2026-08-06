import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/token";
import { ADMIN_COOKIE } from "@/lib/constants";

// Routes that authed users visit directly without a session.
const PUBLIC_ADMIN = new Set(["/admin/login"]);
const PUBLIC_API = new Set(["/api/admin/login", "/api/admin/logout"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // Allow the public admin endpoints (login / logout).
  if (PUBLIC_ADMIN.has(pathname) || PUBLIC_API.has(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifyToken(token);

  if (!ok) {
    // API -> JSON 401, pages -> redirect to login.
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
