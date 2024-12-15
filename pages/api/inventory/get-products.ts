import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  switch (req.method) {
    case "GET":
      try {
        const products = await prisma.products.findMany({
          select: {
            barcodeId: true,
            category: true,
            productName: true,
            price: true,
            id: true,
            discontinued: true,
            sku: {
              select: {
                id: true,
                code: true,
                threshold: true,
                weight: true,
                product_status_log: { select: { status: true } },
              },
            },
            _count: {
              select: {
                assignedProducts: {
                  where: {
                    status: "Default",
                  },
                },
              },
            },
          },
        });
        // console.log(products);
        return products
          ? res.status(200).json(products)
          : res.status(404).json({ message: "Oops something went wrong" });
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
