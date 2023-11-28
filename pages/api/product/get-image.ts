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
        const product = await prisma.products.findUnique({
          where: {
            barcodeId,
          },
        });

        return res.status(200).json(product?.image);
      } catch (error) {
        return res.json(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
