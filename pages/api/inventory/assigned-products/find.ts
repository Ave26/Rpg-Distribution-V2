import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { damageBins } from "@prisma/client";

export interface AssignedProducts {
  skuCode: string;
  damageBins: DamageBins[];
}

export type DamageBins = damageBins & {
  row: number;
  shelf: number;
  count: number;
  supplierName: string;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const p = await prisma.assignedProducts
    .findMany({
      where: { damageBinsId: { isSet: true } },
      select: {
        skuCode: true,
        sku: { select: { supplierName: true } },
        damageBins: {
          include: {
            assignedProducts: {
              select: { skuCode: true },
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

          // get the

          if (!count) return [];

          const supplierName = initial.sku.supplierName;

          if (!supplierName) return [];

          const entry = acc.find((data) => data.skuCode === initial.skuCode);
          if (!initial.damageBins) {
            return [];
          }
          const { assignedProducts, row, shelf, ...rest } = initial.damageBins;
          if (!entry) {
            acc.push({
              skuCode: initial.skuCode,
              damageBins: [{ ...rest, count, supplierName, row, shelf }],
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
              });
            }
          }
          return acc;
        },
        []
      );
      console.log(reshape);
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
