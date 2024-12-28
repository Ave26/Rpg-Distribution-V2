import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware } from "../authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const role: string = req.body;
  await prisma.userRoles
    .delete({
      where: { role: role.toUpperCase() },
    })
    .then(() => {
      return res.json(`Role ${role} Deleted`);
    })
    .catch((e) => {
      console.error(e);
      return res.json(e);
    });
}

export default authMiddleware(handler);
