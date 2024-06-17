import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  switch (req.method) {
    case "GET":
      try {
        const records = await prisma.records.findMany({
          select: {
            _count: true,
            id: true,
            clientName: true,
            dateCreated: true,
            // trucks: { select: { status: true } },

            orderedProductsTest: {
              select: {
                productName: true,
                binLocations: {
                  select: {
                    assignedProducts: { select: { status: true }, take: 1 },
                    quantity: true,
                    stockKeepingUnit: {
                      select: { products: { select: { price: true } } },
                    },
                  },
                },
              },
            },
          },
        });
        return res.json(records);
      } catch (error) {
        return res.json(error);
      }
    default:
      break;
  }
}

// export default authMiddleware(handler);
