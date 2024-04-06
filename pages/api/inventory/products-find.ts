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
        const products = await prisma.assignedProducts.findMany({
          include: {
            products: {
              select: {
                productName: true,
                price: true,
                category: true,
              },
            },
            bin: {
              select: {
                id: true,
                shelfLevel: true,
                row: true,
              },
            },
            trucks: {
              select: {
                payloadCapacity: true,
              },
            },
            sku: {
              select: {
                weight: true,
              },
            },
          },
        });

        return products
          ? res.status(200).json({ products, message: "Product Found" })
          : res.status(404).json({
              message: "Product Not Found",
            });
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
