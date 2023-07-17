import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { sign, verify, decode, JwtPayload } from "jsonwebtoken";

export async function middleware(req: NextRequest, res: NextResponse) {
  const cookie = req.cookies.get("token")?.value;
}
