import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { getId } from "@/helper/_helper";
import prisma from "@/lib/prisma";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { capacity, routeCluster } = req.body;
  try {
    switch (req.method) {
      case "POST":
        const { userId } = getId(verifiedToken);
        const trucks = await prisma.trucks.findMany({});
        const newName = trucks?.length + 1;

        await prisma.trucks.create({
          data: {
            name: `truck#${newName}`,
            capacity,
            routeCluster,
          },
        });
        const updatedTrucks = await prisma.trucks.findMany({});

        return res.status(200).json(updatedTrucks);

      default:
        break;
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
