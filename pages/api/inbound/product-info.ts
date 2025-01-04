import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { assignedProducts } from "@prisma/client";
import prisma from "@/lib/prisma";

type TBody = {
  assignedProduct: TAssignedProducts;
  quantity: number;
};

export type TAssignedProducts = Omit<
  assignedProducts,
  | "id"
  | "dateReceive"
  | "binId"
  | "orderedProductsId"
  | "ordersId"
  | "truckName"
  | "productId"
  | "damageBinId"
  | "usersId"
>;

export type ProductInfo = {
  barcodeId: string;
  category: string;
  image: string | null;
  method: string;
  sku: {
    code: string;
    threshold: number;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { barcodeId } = req.body;
  console.log(barcodeId);
  await prisma.products
    .findFirstOrThrow({
      where: { barcodeId },
      select: {
        image: true,
        sku: { select: { code: true, threshold: true } },
        barcodeId: true,
        category: true,
        method: true,
      },
    })
    .then((products) => {
      console.log(products);
      return res.status(200).json(products);
    })
    .catch((e) => {
      console.log(e.message);
      return res.status(500).json(e.message);
    });
}

// export default authMiddleware(handler);
