import { authMiddleware } from "../../authMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { TruckAvailability } from "@prisma/client";
import prisma from "@/lib/prisma";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { status, truckId }: { status: TruckAvailability; truckId: string } =
    req.body;

  console.log({ truckId, status });
  try {
    let UpdatedTruck;
    await prisma.$transaction(async (tx) => {
      const currentTruck = await tx.trucks.findUnique({
        where: { id: truckId },
      });

      // if (currentTruck?.status) {
      //   return res.status(200).json({
      //     message: `Current Status is already in ${currentTruck.status}`,
      //   });
      // } else {
      // }
      UpdatedTruck = await prisma.trucks.update({
        where: { id: truckId },
        data: { status },
      });
    });
    return (
      UpdatedTruck &&
      res.status(200).json({
        message: "Truck Updated",
        UpdatedTruck,
      })
    );
  } catch (error) {
    return res.send(error);
  }
}

export default authMiddleware(handler);
