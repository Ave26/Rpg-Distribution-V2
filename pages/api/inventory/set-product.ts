import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import {
  TInput,
  TUpdateProductId,
} from "@/components/Inventory/InventoryTypes";

type TBody = {
  updateProduct: TUpdateProductId;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { updateProduct }: TBody = req.body;
  const { barcodeId, id, ...rest } = updateProduct;
  console.log(rest);

  switch (req.method) {
    case "POST":
      try {
        if (!Object.values(rest).some(Boolean)) {
          return res.status(200).send({ message: "Empty Fields" });
        }

        const dataToUpdate: Record<string, number | string> = {
          productName: rest.productName,
          price: Number(rest.price),
        };

        // Remove undefined or empty fields from dataToUpdate
        const filteredData: Record<string, number | string> = {};
        Object.entries(dataToUpdate).forEach(([key, value]) => {
          if (value) {
            filteredData[key] = value;
          }
        });

        const updatedProduct = await prisma.products.update({
          where: {
            id,
            barcodeId,
          },
          data: filteredData,
        });

        return (
          updatedProduct &&
          res.status(200).json({
            message: "Product Updated",
            updatedProduct,
          })
        );
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
