import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { getId } from "@/helper/_helper";
import prisma from "@/lib/prisma";
import { trucks } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { truckData } = req.body;

  try {
    switch (req.method) {
      case "PATCH":
        const { id, status }: trucks = truckData;
        const { userId } = getId(verifiedToken);
        const updatedTruckData = await prisma.trucks.update({
          where: {
            id,
          },
          data: {
            status,
          },
        });
        console.log(updatedTruckData);

        return res.status(200).json(updatedTruckData);

      default:
        return res.send(`Method ${req.method} is not allowed`);
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
