import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { EntriesTypes } from "@/types/binEntries";
import { JwtPayload } from "jsonwebtoken";

import { TFormData } from "@/types/inputTypes";
import { get_order } from "@/lib/prisma/order";
import { scan_barcode } from "@/lib/prisma/scan";
import { assignedProducts } from "@prisma/client";
import prisma from "@/lib/prisma";
import { scanBarcode } from "@/lib/prisma/inbound";

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

          // res
          //   .status(200)
          //   .json({ message: "Processing in progress. It may take a while." });

          let msg: string | undefined = "success";
          for (let i = 0; i < quantity; i++) {
            console.log(`1 ${i}`);
            const { message } = await scanBarcode(assignedProduct, userId);
            msg = message;
          }

          return res.status(200).json(msg);
        } else {
          console.log("single operation");
          // res
          //   .status(200)
          //   .json({ message: "Processing in progress. It may take a while." });

          const { message } = await scanBarcode(assignedProduct, userId);
          return res.status(200).json(message);
        }
      } catch (error) {
        console.log(error);
        return res.json(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
