import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { authMiddleware, UserToken } from "../authMiddleware";
import {} from "@prisma/client";

export type InventoryMethod = "FIFO" | "FEFO" | "LIFO";

export type CreateProduct = {
  barcodeId: string;
  category: string | "default";
  image: string | null;
  price: number;
  productName: string;
  code: string;
  weight: number;
  threshold: number;
  supplierName: string;
  method: InventoryMethod | "default";
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const {
    barcodeId,
    category,
    image,
    price,
    productName,
    method,
    ...rest
  }: CreateProduct = req.body;

  if (!Object.values(req.body).every(Boolean) || category === "default")
    return res.json({ message: "Incomplete Field" });

  // console.log(req.body);
  const product = await prisma.products.create({
    data: {
      barcodeId,
      category,
      price,
      productName,
      method,
      image,
      sku: { create: rest },
    },
  });
  // console.log(product);
  return res.json("Success");
}

export default authMiddleware(handler);

//   try {
//     if (!Object.values(newProduct).every(Boolean)) {
//       return res.status(401).json({ message: "Incomplete Field" });
//     }
//     const product = await prisma.products.findUnique({
//       where: {
//         barcodeId,
//         sku: {
//           some: {
//             code,
//           },
//         },
//       },
//       include: {
//         sku: {
//           select: {
//             code: true,
//           },
//         },
//       },
//     });
//     if (product) {
//       return res.status(500).json({
//         message: `Barcode ${product.barcodeId} and SKU ${product.sku?.map(
//           (sku) => sku.code
//         )} are already exists`,
//       });
//     }
//     const products = await prisma.products.create({
//       data: {
//         barcodeId,
//         category,
//         productName,
//         image,
//         price,
//         sku: {
//           create: {
//             threshold: th,
//             code,
//             weight,
//           },
//         },
//       },
//     });
//     return res.status(200).json({ message: "Product Added", products });
//   } catch (error) {
//     return res.json(error);
//   }
