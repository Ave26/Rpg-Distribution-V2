import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {
  const cookies = req.cookies.get("token");

  if (cookies) {
    console.log("working only in index ");
  } else {
  }
}
export const config = {
  matcher: "/dashboard:path*",
};
