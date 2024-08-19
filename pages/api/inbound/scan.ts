import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";

import { assignedProducts } from "@prisma/client";
import { scanBarcode } from "@/lib/prisma/inbound";
import { TScanData } from "@/pages/dashboard/barcode-scanner";

export type TAssignedProducts = Pick<
  assignedProducts,
  | "dateReceived"
  | "expirationDate"
  | "binId"
  | "usersId"
  | "purchaseOrder"
  | "boxSize"
  | "quality"
  | "supplierName"
  | "skuCode"
  | "barcodeId"
>;

export type TScanDataFinal = TScanData & {
  category: string;
  threshold: number;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | UserToken
) {
  const scanData: TScanDataFinal = req.body;
  try {
    const user = verifiedToken as UserToken;
    const { quantity, boxSize, quality, ...rest } = scanData;
    const hasValue = Object.values(rest).every(Boolean); // true | false
    if (!hasValue || rest.skuCode === "default") {
      console.log("Incomplete Field");
      return res.json("Incomplete Field");
    }

    if (quantity > 1) {
      const data = await scanBarcode(scanData, user.id);
      return res.json(data);
    } else {
      console.log("scanning multiple");
      // const data = await scanMultiple(scanData, user.id);

      return res.json("scanning multiple");
    }
  } catch (error) {
    return res.send(error);
  }
}

export default authMiddleware(handler);
