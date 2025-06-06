import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const pages = await prisma.categories
    .findMany({
      distinct: "category",
      select: {
        id: true,
        category: true,
        bins: { distinct: "rackName", select: { rackName: true } },
      },
    })
    .catch((e) => {
      console.log(e);
      return res.json(e);
    });

  // console.log(pages);
  return res.json(pages);
}

export default authMiddleware(handler);
