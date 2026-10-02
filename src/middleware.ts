import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    if (req.nextUrl.pathname === "/admin/login") {
      if (token && (token.role === "ADMIN" || token.role === "PRODUCT_MANAGER")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
  },
  {
    secret: process.env.NEXTAUTH_SECRET || "shiv_commerce_secret_fallback_key_2026_xyz",
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        if (req.nextUrl.pathname.startsWith('/admin')) {
          const role = (token?.role as string)?.toUpperCase();
          if (role === "ADMIN") return true;
          if (role === "PRODUCT_MANAGER") {
            const path = req.nextUrl.pathname;
            if (path === '/admin' || path.startsWith('/admin/products')) {
              return true;
            }
            return false;
          }
          return false;
        }
        if (req.nextUrl.pathname.startsWith('/account')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
