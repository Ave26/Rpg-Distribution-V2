import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { findBinsByUniqueIds } from "@/lib/prisma/bin";

type TRequest = {
  barcodeId: string;
  productName: string;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { barcodeId, productName }: TRequest = req.body;

  if (!barcodeId || !productName)
    return res.status(500).json({ message: "Undefined Search Field" });

  switch (req.method) {
    case "POST":
      await findBinsByUniqueIds(barcodeId, productName);

      break;

    default:
      res.send(`${req.method} is not allowed`);
      break;
  }
}

export default authMiddleware(handler);
