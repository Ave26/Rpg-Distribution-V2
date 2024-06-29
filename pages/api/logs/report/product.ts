import { NextApiRequest, NextApiResponse } from "next";
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
        /* taking the product that has been taken by the binslocation */

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Get the end of the day
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const record = await prisma.records.findMany({
          where: { dateCreated: { gte: startOfDay, lte: endOfDay } },
          include: {
            orderedProductsTest: {
              select: {
                productName: true,
                _count: true,
                binLocations: {
                  select: {
                    _count: true,
                    assignedProducts: { select: { id: true } },
                  },
                },
              },
            },
          },
        });

        console.log(record);

        return res.send(record);
      } catch (error) {
        return res.json(error);
      }
    default:
      break;
  }
}

// export default authMiddleware(handler);
