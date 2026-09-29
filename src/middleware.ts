import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Chặn toàn bộ /admin/** ở tầng edge: chưa đăng nhập -> về /dang-nhap,
// đã đăng nhập nhưng không phải ADMIN -> về trang chủ.
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/dang-nhap",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
