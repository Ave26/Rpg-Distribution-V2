import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import {
  TInput,
  TUpdateProductId,
} from "@/components/Inventory/InventoryTypes";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const {
    id,
    price,
    productName,
    skuCode,
    threshold,
    weight,
    barcodeId,
  }: TUpdateProductId = req.body;

  switch (req.method) {
    case "POST":
      try {
        if ((!price && !productName && !skuCode && !threshold) || !weight) {
          return res.status(404).json({
            message: "All fields are empty",
          });
        }

        // let data: Record<string, any> = {};

        // // Add fields to data object if they are provided
        // if (productName !== undefined) {
        //   data.productName = productName;
        // }

        // if (price !== undefined) {
        //   data.price = price;
        // }

        // if (skuCode !== undefined) {
        //   data.sku = {
        //     create: {
        //       code: skuCode,
        //     },
        //   };
        // }

        // const updatedProduct = await prisma.products.update({
        //   where: {
        //     id,
        //   },
        //   data,
        // });
        // console.log(updatedProduct);
        // console.log(price, productName, skuCode, threshold);

        // const updatedProduct = await prisma.products.update({
        //   where: { id },
        //   data: {
        //     ...(barcodeId !== undefined && { barcodeId }), // Include barcodeId only if it is not undefined
        //   },
        // });

        // const updatedProduct = await prisma.products.update({
        //   where: { id },
        //   data: {
        //     barcodeId,
        //     price,
        //     sku: {
        //       create: {
        //         code: String(skuCode),
        //         threshold: Number(threshold),
        //         weight: Number(weight),
        //       },
        //     },
        //   },
        // });

        const data = {
          id,
          price,
          productName,
          skuCode,
          threshold,
          weight,
          barcodeId,
        };

        return data && res.status(200).json(data);
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
