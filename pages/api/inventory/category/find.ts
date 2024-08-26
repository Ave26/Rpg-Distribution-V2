import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  try {
    const categories = await prisma.damageCategory
      .findMany({
        select: { category: true, _count: { select: { damageBins: true } } },
      })
      .then((value) => {
        return value.map((v) => ({
          category: v.category,
          count: v._count.damageBins,
        }));
      });

    console.log(categories);
    return res.json(categories);
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
