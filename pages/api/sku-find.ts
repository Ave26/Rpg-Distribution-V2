import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware } from "./authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { skuCode } = req.body;
  console.log(skuCode);

  switch (req.method) {
    case "POST":
      try {
        const sku = await prisma.stockKeepingUnit.findUnique({
          where: {
            code: skuCode,
          },
        });
        console.log(sku);
        return res.status(200).json(sku);
      } catch (error) {
        return res.json(error);
      }

    default:
      break;
  }
}

export default authMiddleware(handler);
