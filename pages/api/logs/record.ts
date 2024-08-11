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
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Get the end of the day
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const records = await prisma.records.findMany({
          where: {
            dateCreated: {
              // gte: startOfDay,
              lte: endOfDay,
            },
          },
          select: {
            _count: true,
            id: true,
            clientName: true,
            dateCreated: true,
            // trucks: { select: { status: true } },
            SO: true,
            orderedProducts: {
              select: {
                _count: true,
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
