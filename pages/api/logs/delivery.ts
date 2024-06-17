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
        const deliveryLogs = await prisma.deliveryLogs.findMany({
          include: { trucks: { select: { truckName: true } } },
          orderBy: { timeStamp: "desc" },
          take: 150,
        });

        return res.json(deliveryLogs);
      } catch (error) {
        return res.json(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
