import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";

import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { barcodeId } = req.body;
  switch (req.method) {
    case "POST":
      try {
        const stockKeepingUnit = await prisma.stockKeepingUnit.findMany({
          where: {
            products: {
              barcodeId,
            },
          },
        });
        // const sku = stockKeepingUnit.map((sku) => sku.code);
        // const bId = stockKeepingUnit.map((data) => data.barcodeId);
        console.log(stockKeepingUnit);
        return res.status(200).json(stockKeepingUnit);
      } catch (error) {
        return res.json(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
