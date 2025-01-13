import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  switch (req.method) {
    case "GET":
      try {
        const deliveryLogs = await prisma.deliveryLogs.findMany({
          include: { trucks: { select: { truckName: true } } },
          orderBy: [{ trucks: { truckName: "desc" } }, { timeStamp: "desc" }],
        });

        console.log(deliveryLogs);

        const groupedLogs = deliveryLogs?.reduce(
          (acc: Record<string, (typeof deliveryLogs)[number][]>, log) => {
            const truckName = log.trucks?.truckName || "Unknown Truck";
            if (!acc[truckName]) {
              acc[truckName] = [];
            }
            acc[truckName].push(log);
            return acc;
          },
          {}
        );
        console.log(groupedLogs);
        return res.json(groupedLogs);
      } catch (error) {
        console.log(error);
        return res.json(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
