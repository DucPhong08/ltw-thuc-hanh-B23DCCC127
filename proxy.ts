import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((req) => {
  const { pathname, search } = req.nextUrl;
  const user = req.auth?.user;

  // Nếu đã đăng nhập mà vào lại /login thì redirect về /dashboard
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  // Lớp 1 — Middleware/Proxy: Bảo vệ /dashboard và /admin
  if (isDashboard || isAdmin) {
    if (!user) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && user.role !== "admin") {
      return NextResponse.redirect(new URL("/403", req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
