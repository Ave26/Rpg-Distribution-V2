import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { assignedProducts } from "@prisma/client";
import { getProductInfo, scanBarcode } from "@/lib/prisma/inbound";

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
  try {
    const { productInfo } = await getProductInfo(barcodeId);
    console.log(productInfo);
    return res.status(200).json(productInfo);
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
}

// export default authMiddleware(handler);
