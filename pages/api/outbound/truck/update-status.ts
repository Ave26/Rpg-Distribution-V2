import { authMiddleware } from "../../authMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { TruckAvailability } from "@prisma/client";
import prisma from "@/lib/prisma";
import { updateTrucks } from "@/lib/prisma/trucks";
import { stat } from "fs";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { status, truckId }: { status: TruckAvailability; truckId: string } =
    req.body;

  let userId: string = "";
  if (verifiedToken && typeof verifiedToken === "object") {
    userId = verifiedToken.id;
  }
  try {
    let updatedTruck;
    let logs;

    const deliveryLogs = {
      create: {
        driverId: userId,
        status,
      },
    };

    await prisma.$transaction(async (tx) => {
      const truck = await tx.trucks.findUniqueOrThrow({
        where: { id: truckId },
        include: { records: { include: { orderedProducts: true } } },
      });
      console.log(truck);

      if (status === "InTransit" || status === "Delivered") {
        // if (status === "Delivered") {
        //   // check first if the product inside has been delivered before settings into delivered status
        //   const productInsideTruck = prisma.trucks.findFirst({
        //     select: {
        //       assignedProducts: true,
        //     },
        //   });
        //   console.log(productInsideTruck);
        // }
        updatedTruck = await prisma.trucks.update({
          where: { id: truckId },
          data: {
            status,
            driverId: userId,
            deliveryLogs,
          },
        });
      } else {
        updatedTruck = await prisma.trucks.update({
          where: { id: truckId },
          data: {
            status,
            driverId: {
              unset: true,
            },
            deliveryLogs,
          },
        });
      }
    });

    // return (
    //   updatedTruck &&
    //   res.status(200).json({
    //     message: "Truck Updated",
    //     updatedTruck,
    //     logs,
    //   })
    // );

    return res.send("this is the update truck");
  } catch (error) {
    return res.send(error);
  }
}

export default authMiddleware(handler);
