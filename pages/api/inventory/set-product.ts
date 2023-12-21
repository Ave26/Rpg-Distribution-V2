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
  console.log(updateProduct);
  // const { price, productName, skuCode, threshold, weight, ...rest } =
  //   updateProduct;
  switch (req.method) {
    case "POST":
      try {
        if (!Object.values(rest).every(Boolean)) {
          return res.status(204).json({ message: "Empty Fields" });
        }

        // remove the key if it is undefiend or it is empty field

        const dataToUpdate: Record<string, number | string | undefined> = {
          productName: rest.productName,
          price: rest.price,
        };
        const keyToUpdate = dataToUpdate[rest.price || rest.productName];

        // const updatedProduct = await prisma.products.update({
        //   where: {
        //     id,
        //     barcodeId,
        //   },
        //   data: keyToUpdate,
        // });

        // if (
        //   price === undefined &&
        //   productName === undefined &&
        //   skuCode === undefined &&
        //   weight === undefined
        // ) {
        //   return res.status(422).json({ message: "undefined" });
        // }

        // if (price !== undefined) dataToUpdate.price = price;
        // if (productName !== undefined) dataToUpdate.productName = productName;
        // // if (skuCode !== undefined) dataToUpdate.skuCode = skuCode;
        // // if (threshold !== undefined) dataToUpdate.threshold = threshold;
        // // if (weight !== undefined) dataToUpdate.weight = weight;
        // console.log(skuCode);
        // Object.keys(dataToUpdate).forEach(
        //   (key) => !dataToUpdate[key] && delete dataToUpdate[key]
        // );
        // console.log(dataToUpdate);

        // const updatedProduct = await prisma.products.update({
        //   where: {
        //     id: rest.id,
        //   },
        //   data: dataToUpdate,
        // });

        // update\\\\\

        // const sku = await prisma.stockKeepingUnit.upsert({
        //   where: {
        //     barcodeId: rest.barcodeId,
        //     code: skuCode,
        //   },
        //   create: {
        //     code: skuCode,
        //     weight: 0, // Replace with the actual weight value
        //     color: "default_color", // Replace with the actual color value
        //     threshold: 0, // Replace with the actual threshold value
        //   },
        //   update: {}, // This can be an empty object since you are creating a new entry
        // });

        // I also want to create using prisma upsert

        return res.status(200).json(updateProduct);
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
