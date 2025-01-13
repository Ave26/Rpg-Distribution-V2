// import { NextApiRequest, NextApiResponse } from "next";
// import { JwtPayload } from "jsonwebtoken";
// import { assignedProducts } from "@prisma/client";
// import prisma from "@/lib/prisma";
// import { z } from "zod";

// const BarcodeSchema = z.object({
//   barcodeId: z.string(),
// });

// type TBody = {
//   assignedProduct: TAssignedProducts;
//   quantity: number;
// };

// export type TAssignedProducts = Omit<
//   assignedProducts,
//   | "id"
//   | "dateReceive"
//   | "binId"
//   | "orderedProductsId"
//   | "ordersId"
//   | "truckName"
//   | "productId"
//   | "damageBinId"
//   | "usersId"
// >;

export type ProductInfo = {
  barcodeId: string;
  category: string;
  image: string | null;
  method: string;
  sku: SKUType[];
};

export type SKUType = {
  code: string;
  threshold: number;
};

export type ProductScan = {
  barcodeId: string;
  skuCode: string;
  currentBarcodeId: string;
  quantity: number;
  boxSize: BoxSize | "default";
  date: Date;
  quality: ProductQuality;
  purchaseOrder: string;
  threshold: number;
  category: string;
  method: InventoryMethod;
};

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   verifiedToken: string | JwtPayload | undefined
// ) {
//   const query = BarcodeSchema.safeParse(req.query);
//   if (query.error) return res.json(query.error);
//   const { data: barcodeId } = query;

//   await prisma.products
//     .findFirstOrThrow({
//       where: { barcodeId: "" },
//       select: {
//         image: true,
//         sku: { select: { code: true, threshold: true } },
//         barcodeId: true,
//         category: true,
//         method: true,
//       },
//     })
//     .then((products) => {
//       console.log(products);
//       return res.status(200).json(products);
//     })
//     .catch((e) => {
//       console.log(e.message);
//       return res.status(500).json(e.message);
//     });
// }

// // export default authMiddleware(handler);

import {
  assignedProducts,
  BoxSize,
  PrismaClient,
  ProductQuality,
} from "@prisma/client";
import { authMiddleware, UserToken } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { scanBarcode } from "@/lib/prisma/inbound";
import prisma from "@/lib/prisma";
import { InventoryMethod } from "../products/create";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { currentBarcodeId, ...product }: ProductScan = req.body;
  const { barcodeId, skuCode, quantity } = product;

  console.log(product.barcodeId);

  if (!skuCode || skuCode === "default" || barcodeId !== currentBarcodeId) {
    await prisma.products
      .findUniqueOrThrow({
        where: { barcodeId }, // Prisma will handle the correct type for barcodeId
        select: {
          image: true,
          sku: { select: { code: true, threshold: true } },
          barcodeId: true,
          category: true,
          method: true,
        },
      })
      .then((product) => {
        return res.status(200).json(product);
      })
      .catch((error: Error) => {
        console.log(error);
        return res.status(500).json({ error });
      });
  } else {
    const userId = verifiedToken.id;

    if (quantity > 1) {
      console.log("scanning multiple");
      // const data = await scanMultiple(scanData, user.id);
      return res.json("scanning multiple");
    } else {
      console.log("scanning single");
      const { quantity, boxSize, quality, ...scan } = product;
      const hasValue = Object.values(scan).every(Boolean);

      if (!hasValue || scan.skuCode === "default" || boxSize === "default") {
        console.log("Incomplete Field");
        return res.status(404).json("Incomplete Field");
      }

      const data = await scanBarcode(
        {
          ...scan,
          boxSize,
          quality,
          quantity,
          skuCode,
        },
        userId
      );

      return res.json(data);
    }
    /*     
    
    quantity, boxSize, quality,
    barcodeId: string;
    skuCode: string;
    purchaseOrder: string;
    date: Date;
    method?: InventoryMethod;
    category: string;
    threshold: number; 


    console.log({
          barcodeId,
          skuCode,
          currentBarcodeId,
          quantity,
          boxSize,
          quality,
          date,
          purchaseOrder,
          category,
          method,
          threshold,
        });






    */
  }
}

export default authMiddleware(handler);
