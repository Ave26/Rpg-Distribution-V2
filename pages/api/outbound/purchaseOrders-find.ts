import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { purchaseOrderOutbound }: { purchaseOrderOutbound: string } = req.body;
  console.log(purchaseOrderOutbound);
  try {
    switch (req.method) {
      case "POST":
        const POOs = await prisma.purchaseOrderOutBound.findMany({
          where: {
            poId: purchaseOrderOutbound,
          },
        });

        if (!POOs) {
          return res.status(404).json({
            message: "No record found",
          });
        }

        return res.status(200).json({
          message: purchaseOrderOutbound,
          POOs,
        });

      default:
        break;
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
