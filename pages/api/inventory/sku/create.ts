import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { authMiddleware } from "../../authMiddleware";
import { TSKU } from "@/components/Inventory/InventoryTypes";

type TBody = { SKU: TSKU; code: string };

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { SKU, code }: TBody = req.body;

  switch (req.method) {
    case "POST":
      try {
        const newSKU = Object.fromEntries(
          Object.entries(SKU).map(([key, value]) =>
            key === "code" ? ["code", code] : [key, value]
          )
        ) as TSKU;
        const { barcodeId, ...rest } = newSKU;

        if (!Object.values(rest).every(Boolean)) {
          return res.status(400).json({ message: "Incomplete Fields" });
        }

        const skuFound = await prisma.stockKeepingUnit.findUnique({
          where: { code },
        });

        if (skuFound) {
          return res.status(200).json({ message: "SKU Already Exists" });
        }

        const SKUCreated = await prisma.stockKeepingUnit.create({
          data: newSKU,
        });

        return res.status(201).json({ message: "SKU Created", SKUCreated });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default authMiddleware(handler);
