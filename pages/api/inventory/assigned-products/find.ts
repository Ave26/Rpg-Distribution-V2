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
        damageBins: {
          include: {
            assignedProducts: {
              select: { skuCode: true, supplierName: true },
            },
          },
        },
      },
    })
    .then((assignedProducts) => {
      const reshape = assignedProducts.reduce(
        (acc: AssignedProducts[], initial) => {
          const data = initial.damageBins?.assignedProducts.filter(
            (v) => v.skuCode === initial.skuCode
          );
          if (!data?.length) {
            console.log("triggers");
            return [];
          }
          const supplierName = data[0].supplierName;

          const entry = acc.find((data) => data.skuCode === initial.skuCode);
          if (!initial.damageBins) {
            return [];
          }
          const { assignedProducts, ...rest } = initial.damageBins;
          if (!entry) {
            acc.push({
              skuCode: initial.skuCode,
              damageBins: [{ ...rest, count: data.length, supplierName }],
            });
          } else {
            const isDuplicate = entry.damageBins.some(
              (bin) => bin.id === initial.damageBins?.id
            );

            if (!isDuplicate) {
              entry.damageBins.push({
                ...rest,
                count: data.length,
                supplierName,
              });
            }
          }
          return acc;
        },
        []
      );
      return reshape;
    })
    .catch((e) => res.json(e));

  return res.json(p);
}

export default authMiddleware(handler);
