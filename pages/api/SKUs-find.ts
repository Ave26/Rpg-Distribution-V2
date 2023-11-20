import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware } from "./authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { SKUs } = req.body;
  console.log(SKUs);

  switch (req.method) {
    case "POST":
      try {
        const skus = await prisma.stockKeepingUnit.findMany({
          where: {
            code: {
              in: SKUs,
            },
          },
        });
        console.log(skus);
        return res.status(200).json(skus);
      } catch (error) {
        return res.json(error);
      }

    default:
      break;
  }
}

export default authMiddleware(handler);
