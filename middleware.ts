import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const tokens = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  console.log("Middleware running on:", path);
  console.log("Token in middleware:", tokens);

  // ✅ Redirect away from login if already authenticated
  if (!tokens && path !== "/login")
    return NextResponse.redirect(new URL("/login", request.url));

  // 🚫 Block access to protected routes if not authenticated
  if ((tokens && path === "/login") || path === "/") {
    if (tokens && process.env.JWT_SECRET) {
      const { payload } = await jwtVerify(tokens, secret);

      switch (payload.role) {
        case "STAFF":
          return NextResponse.redirect(
            new URL("/dashboard/add-product", request.url)
          );
        case "ADMIN":
          return NextResponse.redirect(
            new URL("/dashboard/log-overview", request.url)
          );

        case "SUPERADMIN":
          return NextResponse.redirect(
            new URL("/dashboard/log-overview", request.url)
          );

        case "DRIVER":
          return NextResponse.redirect(
            new URL("/dashboard/delivery-management", request.url)
          );
        default:
          break;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
