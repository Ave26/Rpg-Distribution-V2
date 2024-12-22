import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { DamageBinButton } from "@/components/Inventory/DamageInventory";
import { renderToStream } from "@react-pdf/renderer";
import DamageBinDocument from "@/components/Report/Inventory/DamageBinDocument";
import { AssignedProducts } from "../../inventory/assigned-products/find";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const damageReport: DamageBinButton = req.body;
  try {
    const p = await prisma.assignedProducts
      .findMany({
        where: { damageBinsId: { isSet: true } },
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
            const { assignedProducts, row, shelf, ...rest } =
              initial.damageBins;
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
        console.log(reshape);
        return reshape;
      });

    const pdfStream = await renderToStream(<DamageBinDocument products={p} />);
    console.log(p);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Order_Report_${"bins download"}.pdf`
    );

    return pdfStream.pipe(res);
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
