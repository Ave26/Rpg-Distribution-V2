import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
// import { UserRole } from "@prisma/client";
import Products from "@/pages/products";
import { authMiddleware, UserToken } from "../../authMiddleware";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { sku }: Partial<{ sku: string }> = req.query;
  console.log(sku?.trim);

  const bins = await prisma.bins
    .findMany({
      where: {
        assignedProducts: {
          some: {
            status: "Default",
            quality: "Good",
            damageBinsId: { isSet: false },
            skuCode: sku,
          },
        },
      },
      orderBy: [{ category: "asc" }, { row: "asc" }, { shelfLevel: "asc" }],
      select: {
        id: true,
        row: true,
        shelfLevel: true,
        category: true,
        capacity: true,
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

        assignedProducts: {
          where: {
            status: "Default",
            quality: "Good",
            damageBinsId: { isSet: false },
          },
          select: {
            binId: true,
            id: true,
            skuCode: true,
            barcodeId: true,
            sku: { select: { weight: true } },
            products: {
              select: { category: true, productName: true, price: true },
            },
          },
        },
      },
    })
    .catch((e) => {
      return res.json(e);
    });

  console.log(bins);
  return res.status(200).json(bins);
}

export default authMiddleware(handler);
