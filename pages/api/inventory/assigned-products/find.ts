import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { damageBins } from "@prisma/client";

export interface AssignedProducts {
  skuCode: string;
  productName: string;
  damageBins: DamageBins[];
}

export type DamageBins = damageBins & {
  row: number;
  shelf: number;
  count: number;
  supplierName: string;
  purchaseOrder: string[]; // added
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const p = await prisma.assignedProducts
    .findMany({
      where: {
        damageBinsId: { isSet: true },
      },
      select: {
        skuCode: true,
        sku: {
          select: {
            supplierName: true,
            products: { select: { productName: true } },
          },
        },
        damageBins: {
          include: {
            assignedProducts: {
              select: {
                skuCode: true,
                purchaseOrder: true,
              },
            },
          },
        },
      },
    })
    .then((assignedProducts) => {
      const reshape = assignedProducts.reduce(
        (acc: AssignedProducts[], initial) => {
          const count = initial.damageBins?.assignedProducts.filter(
            (v) => v.skuCode === initial.skuCode
          ).length;

          if (!count) return [];

          const supplierName = initial.sku.supplierName;

          if (!supplierName) return [];

          const entry = acc.find((data) => data.skuCode === initial.skuCode);
          if (!initial.damageBins || !initial.sku.products?.productName) {
            return [];
          }
          const { assignedProducts, row, shelf, ...rest } = initial.damageBins;
          const POs = assignedProducts.map((v) => v.purchaseOrder);
          const distinctPOs = [...new Set(POs)];

          if (!entry) {
            acc.push({
              skuCode: initial.skuCode,
              productName: initial.sku.products.productName,
              damageBins: [
                {
                  ...rest,
                  count,
                  supplierName,
                  row,
                  shelf,
                  purchaseOrder: distinctPOs ?? [],
                },
              ],
            });
          } else {
            const isDuplicate = entry.damageBins.some(
              (bin) => bin.id === initial.damageBins?.id
            );

            if (!isDuplicate) {
              entry.damageBins.push({
                ...rest,
                count,
                supplierName,
                row,
                shelf,
                purchaseOrder: distinctPOs ?? [],
              });
            }
          }
          return acc;
        },
        []
      );
      return reshape;
    })
    .catch((e) => {
      console.log(e);
      res.json(e);
    });
  console.log(p);
  return res.json(p);
}

export default authMiddleware(handler);
