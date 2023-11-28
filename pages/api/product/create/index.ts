import { verifyJwt } from "@/lib/helper/jwt";
// import { addNewProduct } from "@/lib/prisma/product";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { products, stockKeepingUnit } from "@prisma/client";
import prisma from "@/lib/prisma";
import { TProducts } from "@/types/productTypes";

type TReqBody = {
  newProduct: TProducts;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { newProduct }: TReqBody = req.body;
  const {
    barcodeId,
    category,
    image,
    price,
    productName,
    sku: { code, color, weight, threshold },
  } = newProduct;
  const th = Number(threshold);

  try {
    if (!Object.values(newProduct).every(Boolean)) {
      return res.status(401).json({ message: "Incomplete Field" });
    }

    const product = await prisma.products.findUnique({
      where: {
        barcodeId,
        sku: {
          some: {
            code,
          },
        },
      },
      include: {
        sku: {
          select: {
            code: true,
          },
        },
      },
    });

    if (product) {
      return res.status(500).json({
        message: `Barcode ${product.barcodeId} and SKU ${product.sku?.map(
          (sku) => sku.code
        )} are already exists`,
      });
    }

    const products = await prisma.products.create({
      data: {
        barcodeId,
        category,
        productName,
        image,
        price,
        sku: {
          create: {
            threshold: th,
            code,
            color,
            weight,
          },
        },
      },
    });

    return res.status(200).json({ message: "Product Added", products });
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
