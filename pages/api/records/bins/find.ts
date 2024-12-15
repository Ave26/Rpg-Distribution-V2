import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { authMiddleware, UserToken } from "../../authMiddleware";
import { UserRole } from "@prisma/client";
import Products from "@/pages/products";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  try {
    switch (req.method) {
      case "GET":
        const bins = await prisma.bins
          .findMany({
            where: {
              assignedProducts: {
                some: {
                  status: "Default",
                  quality: "Good",
                  damageBinsId: { isSet: false },
                },
              },
            },
            orderBy: [
              { category: "asc" },
              { row: "asc" },
              { shelfLevel: "asc" },
            ],
            select: {
              _count: {
                select: {
                  assignedProducts: {
                    where: {
                      status: "Default",
                      quality: "Good",
                      damageBinsId: { isSet: false },
                    },
                  },
                },
              },
              row: true,
              shelfLevel: true,
              id: true,
              assignedProducts: {
                where: {
                  status: "Default",
                  quality: "Good",
                  damageBinsId: { isSet: false },
                },
                select: {
                  binId: true,
                  skuCode: true,
                  barcodeId: true,
                  sku: { select: { weight: true } },
                  products: {
                    select: { category: true, productName: true, price: true },
                  },
                },
                take: 1,
              },
            },
          })
          .catch((e) => console.log(e));
        console.log(bins);
        return res.status(200).json(bins);
      default:
        return res.status(500).json({ message: `${req.method} forbidden` });
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
}

export default authMiddleware(handler);
// merong laman, pres 10 per cat
