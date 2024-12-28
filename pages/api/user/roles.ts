import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware } from "../authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  await prisma.userRoles
    .findMany({ select: { role: true, id: true } })
    .then((users) => {
      res.json(users);
    });
}

export default authMiddleware(handler);
