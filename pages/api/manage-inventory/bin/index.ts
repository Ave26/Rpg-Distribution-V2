import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { ProductQuality, ProductStatus, bins } from "@prisma/client";
import { TBinPage } from "@/features/manage-inventory";

// export interface InventoryBins {
//   bin: {
//     binId: string;
//     count: number;
//     category: string;
//     rackName: string;
//     row: number;
//     shelfLevel: number;
//   };
//   product?: {
//     id: string;
//     skuCode: string;
//     barcodeId: string;
//     dateInfo: { type: string; date: Date };
//     quality: ProductQuality;
//     status: ProductStatus;
//     productName: string;
//     threshold: number;
//     POs: string[];
//   };
// }

// export type InventoryPage = {
//   category: string | "default";
//   rackName: string | "default";
//   shelfLevel: number;
//   row: number;
// };

// export function isCategoryParams(query: any): query is InventoryPage {
//   return (
//     typeof query.category === "string" &&
//     typeof query.rackName === "string" &&
//     typeof query.shelfLevel === "number" &&
//     typeof query.row === "number"
//   );
// }

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const page = req.query as TBinPage;
  const binPage = Object.fromEntries(
    Object.entries(page).filter(([_, value]) => value !== "default")
  );

  const bins = await prisma.bins
    .findMany({
      where: { ...binPage },
      orderBy: [
        { category: "asc" },
        { rackName: "asc" },
        { row: "asc" },
        { shelfLevel: "asc" },
      ],
      select: {
        id: true,
        category: true,
        row: true,
        shelfLevel: true,
        rackName: true,
        _count: {
          select: {
            assignedProducts: {
              where: {
                status: { in: ["Default", "Queuing"] },
                damageBinsId: { isSet: false },
                quality: "Good",
              },
            },
          },
        },
        assignedProducts: {
          where: {
            status: { in: ["Default", "Queuing"] },
            damageBinsId: { isSet: false },
            quality: "Good",
          },
          select: {
            skuCode: true,
            dateInfo: { select: { date: true } },
            products: { select: { productName: true } },
          },
          take: 1,
        },
      },
    })
    .catch((e) => console.log(e));

  return res.status(200).json(bins);
}

export default authMiddleware(handler);
