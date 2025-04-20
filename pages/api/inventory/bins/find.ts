import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { ProductQuality, ProductStatus, bins } from "@prisma/client";

export interface InventoryBins {
  bin: {
    binId: string;
    count: number;
    category: string;
    rackName: string;
    row: number;
    shelfLevel: number;
  };
  product?: {
    id: string;
    skuCode: string;
    barcodeId: string;
    dateInfo: { type: string; date: Date };
    quality: ProductQuality;
    status: ProductStatus;
    productName: string;
    threshold: number;
    POs: string[];
  };
}

export type InventoryPage = {
  category: string | "default";
  rackName: string | "default";
  shelfLevel: number;
  row: number;
};

export function isCategoryParams(query: any): query is InventoryPage {
  return (
    typeof query.category === "string" &&
    typeof query.rackName === "string" &&
    typeof query.shelfLevel === "number" &&
    typeof query.row === "number"
  );
}

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const inventoryPage = req.query as unknown as InventoryPage;

  console.log(inventoryPage);
  const { row, shelfLevel, ...rest } = inventoryPage;
  const transformPage = {
    ...rest,
    row: Number(row),
    shelfLevel: Number(shelfLevel),
  };

  let newCategoryPage: InventoryPage | {} = {};

  if (isCategoryParams(transformPage)) {
    newCategoryPage = Object.fromEntries(
      Object.entries(transformPage).filter(
        ([_, value]) => value !== "default" && value !== 0
      ) // Keep only non-empty values
    );
  }
  console.log(newCategoryPage);
  const bins = await prisma.bins
    .findMany({
      orderBy: [
        { category: "asc" },
        { rackName: "asc" },
        { row: "asc" },
        { shelfLevel: "asc" },
      ],
      where: newCategoryPage,

      select: {
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
        id: true,
        row: true,
        shelfLevel: true,
        category: true,
        rackName: true,
        assignedProducts: {
          where: {
            status: { in: ["Default", "Queuing"] },
            damageBinsId: { isSet: false },
            quality: "Good",
          },
          include: {
            sku: { select: { threshold: true } },
            products: { select: { productName: true } },
          },
          distinct: "purchaseOrder",
        },
      },
    })
    .then((bins) => {
      // console.log(bins);
      return bins.map((bin): InventoryBins => {
        const { id: binId, _count, category, rackName, row, shelfLevel } = bin;
        const test = rackName ? rackName : "";
        const count = _count.assignedProducts;

        if (count === 0) {
          return {
            bin: { binId, category, count, rackName: test, row, shelfLevel },
            product: undefined, // or any other default value or structure you prefer
          };
        }

        const {
          barcodeId,
          dateInfo,
          id,
          products,
          quality,
          skuCode,
          status,
          sku,
        } = bin.assignedProducts[0];

        const productName = products.productName;
        const threshold = sku.threshold;
        const POs = bin.assignedProducts.map((ap) => ap.purchaseOrder);

        return {
          bin: { binId, category, count, rackName: test, row, shelfLevel },
          product: {
            barcodeId,
            dateInfo,
            id,
            POs,
            productName,
            quality,
            skuCode,
            status,
            threshold,
          },
        };
      });
    })
    .catch((e) => console.log(e));
  console.log(bins);

  return res.status(200).json(bins);
}

export default authMiddleware(handler);
