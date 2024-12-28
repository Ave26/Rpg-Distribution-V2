import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware } from "../authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  console.log(req.body);

  const test = await prisma.users
    .findMany({ select: { username: true, role: true, id: true } })
    .then((users) => res.json(users));

  console.log(test);
}

export default authMiddleware(handler);
