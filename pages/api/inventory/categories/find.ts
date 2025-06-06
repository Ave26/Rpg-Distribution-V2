import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { Categories } from "@/fetcher/fetchCategories";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  // console.log("finding bin Categories...");
  const categories = await prisma.categories
    .findMany({
      select: {
        id: true,
        category: true,
        _count: { select: { bins: true } },
        bins: { distinct: "rackName" },
      },
    })
    .then((value) => {
      return value.map(
        (v): Categories => ({
          id: v.id,
          category: v.category,
          count: v._count.bins,
          rackNames: v.bins.map((v) => v.rackName),
        })
      );
    })
    .catch((e) => {
      console.log(e);
      return res.json(e);
    });

  console.log(categories);
  return res.json(categories);
}

export default authMiddleware(handler);
