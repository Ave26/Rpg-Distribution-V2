import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { EntriesTypes } from "@/types/binEntries";
import { JwtPayload } from "jsonwebtoken";

import { TFormData } from "@/types/inputTypes";
import { get_order } from "@/lib/prisma/order";
import { scan_barcode } from "@/lib/prisma/scan";
import { assignedProducts } from "@prisma/client";
import prisma from "@/lib/prisma";
import { scanBarcode, scanMultipleProduct } from "@/lib/prisma/inbound";

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

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { assignedProduct, quantity }: TBody = req.body; // 40

  switch (req.method) {
    case "POST":
      try {
        if (!Object.values(assignedProduct).every(Boolean)) {
          return res.status(401).json({ message: "Incomplete Field" });
        }

        let userId: string = "";
        if (verifiedToken && typeof verifiedToken === "object") {
          userId = verifiedToken.id;
        }

        if (quantity > 1) {
          console.log("multi operation");
          // const { message } = await scanMultipleProduct(
          //   assignedProduct,
          //   quantity,
          //   userId
          // );
          let msg: string | undefined;
          for (let i = 0; i < quantity; i++) {
            console.log(`1 ${i}`);
            const { message } = await scanBarcode(assignedProduct, userId);
            msg = message;
          }
          return res.status(200).json(msg);
        } else {
          console.log("single operation");

          const { message } = await scanBarcode(assignedProduct, userId);
          console.log(message);
          return res.status(200).json(message);
        }
      } catch (error) {
        console.log(error);
        return res.json(error);
      } finally {
        await prisma.$disconnect();
        console.log("prisma disconnected");
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
