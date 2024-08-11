import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { sign, verify, decode, JwtPayload } from "jsonwebtoken";
import { redirect } from "next/dist/server/api-utils";

export async function middleware(req: NextRequest, res: NextResponse) {
  const cookie = req.cookies.get("token")?.value;
  // console.log(cookie);
  // if (cookie) {
  //   console.log("there is a cookie");

  //   return NextResponse.redirect(new URL("/dashboard/log-overview", req.url));
  // } else {
  //   console.log("no cookie");
  // }
}
