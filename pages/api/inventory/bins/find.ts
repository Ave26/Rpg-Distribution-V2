import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { authMiddleware } from "../../authMiddleware";
import { UserRole } from "@prisma/client";
import Products from "@/pages/products";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & { roles: UserRole; id: string }
) {
  try {
    switch (req.method) {
      case "GET":
        const bins = await prisma.bins.findMany({
          where: { assignedProducts: { some: {} } },
          orderBy: { row: "asc" },
          select: {
            _count: {
              select: { assignedProducts: true },
            },
            row: true,
            shelfLevel: true,
            id: true,
            assignedProducts: {
              where: { status: "Default" },
              select: {
                binId: true,
                skuCode: true,
                barcodeId: true,
                products: {
                  select: { category: true, productName: true, price: true },
                },
              },
              take: 1,
            },
          },
        });
        return res.status(200).json(bins);

      default:
        return res.status(500).json({ message: `${req.method} forbidden` });
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
