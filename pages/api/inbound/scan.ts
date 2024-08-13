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
  console.log(scanData);
  try {
    const user = verifiedToken as UserToken;
    const data = await scanBarcode(scanData, user.id);

    // console.log(data);

    return res.json(data);
  } catch (error) {
    return res.send(error);
  }
}

export default authMiddleware(handler);
