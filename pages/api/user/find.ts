import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware } from "../authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  await prisma.users
    .findMany({ select: { username: true, role: true, id: true } })
    .then((users) => {
      console.log(users);
      return res.json(users);
    })
    .catch((e) => res.json(e));
}

export default authMiddleware(handler);
