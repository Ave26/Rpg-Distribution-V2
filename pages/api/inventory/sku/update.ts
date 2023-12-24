import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { authMiddleware } from "../../authMiddleware";
import { TSKU } from "@/components/Inventory/InventoryTypes";

type TBody = { SKU: TSKU };

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { SKU }: TBody = req.body;
  const { barcodeId, code, ...rest } = SKU;
  switch (req.method) {
    case "POST":
      try {
        if (!Object.values(rest).some(Boolean)) {
          return res.json({ message: "Incomplete Fields" });
        }

        const dataToUpdate: Record<string, number> = {
          weight: rest.weight,
          threshold: rest.threshold,
        };

        const filteredData: Record<string, number | string> = {};
        Object.entries(dataToUpdate).forEach(([key, value]) => {
          if (value) {
            filteredData[key] = value;
          }
        });

        const updatedSKU = await prisma.stockKeepingUnit.update({
          where: {
            barcodeId,
          },
          data: filteredData,
        });

        return res.status(200).json({ message: "SKU Updated", updatedSKU });
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
