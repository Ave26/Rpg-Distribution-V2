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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { barcodeId } = req.body;

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
    .then((products) => res.status(200).json(products))
    .catch((e) => res.json(`{Not Found ${e}`));
}

// export default authMiddleware(handler);
