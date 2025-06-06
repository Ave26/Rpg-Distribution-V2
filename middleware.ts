import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  console.log("Middleware running on:", path);
  console.log("Token in middleware:", token);

  // ✅ Redirect away from login if already authenticated
  if ((token && path === "/login") || path === "/") {
    return NextResponse.redirect(
      new URL("/dashboard/log-overview", request.url)
    );
  }

  // 🚫 Block access to protected routes if not authenticated
  if (!token && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
