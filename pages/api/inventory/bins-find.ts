import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  switch (req.method) {
    case "GET":
      try {
        const bins = await prisma.bins.findMany({
          include: {
            _count: {
              select: {
                assignedProducts: true,
              },
            },

            assignedProducts: {
              select: {
                purchaseOrder: true,
                skuCode: true,
                dateReceive: true,
                expirationDate: true,
                quality: true,
                status: true,
                barcodeId: true,

                products: {
                  select: {
                    category: true,
                    productName: true,
                  },
                },
              },
            },
            racks: {
              include: {
                categories: true,
              },
            },
          },
        });

        return res.status(200).json(bins);
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
