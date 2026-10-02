import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Optionally handle additional logic here
    // e.g. check for admin role
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/admin/login") {
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== "/admin/login") {
          if (token?.role === "ADMIN") return true;
          if (token?.role === "PRODUCT_MANAGER") {
            const path = req.nextUrl.pathname;
            // Allow root admin dashboard, products, and maybe profile if it existed
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
