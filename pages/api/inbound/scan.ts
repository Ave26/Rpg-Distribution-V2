import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { EntriesTypes } from "@/types/binEntries";
import { JwtPayload } from "jsonwebtoken";

import { TFormData } from "@/types/inputTypes";
import { get_order } from "@/lib/prisma/order";
import { scan_barcode } from "@/lib/prisma/scan";
import { assignedProducts } from "@prisma/client";
import prisma from "@/lib/prisma";

type TBody = {
  assignedProduct: TAssignedProducts;
  quantity: number;
};

type TAssignedProducts = Omit<
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

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { assignedProduct, quantity }: TBody = req.body;

  switch (req.method) {
    case "POST":
      try {
        if (!Object.values(assignedProduct).every(Boolean)) {
          return res.status(401).json({ message: "Incomplete Field" });
        }
        const { scanData } = await scan_barcode(assignedProduct, quantity);
        /* 
        PO-12345
        PO-67890
        PO-54321
        PO-98765
        PO-24680
        PO-13579
        PO-11223
        PO-45678
        PO-87654
        PO-54321
      */
        const product = await prisma.products.findUnique({
          where: {
            barcodeId: assignedProduct.barcodeId,
          },
        });

        return res.status(200).json({ scanData });
      } catch (error) {
        return res.json(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
