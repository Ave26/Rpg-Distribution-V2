import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { TUpdateTruckStatus } from "@/components/PickingAndPackingRole/StaffUI/UpdateTruckStatus";
import prisma from "@/lib/prisma";
import { Coordinates, TruckAvailability, trucks } from "@prisma/client";
import { ProductData } from "../product/update-status";
import { TruckStatusRequest } from "./emergency-status";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { coordinates, truckId }: TruckStatusRequest = req.body;
  const userId = verifiedToken.id;
  await prisma.trucks
    .update({
      where: { id: truckId },
      data: {
        status: "EmergencyStop",
        deliveryLogs: {
          create: {
            status: "EmergencyStop",
            driverId: userId,
            timeStamp: new Date(),
            coordinates,
          },
        },
      },
    })
    .then((truck) => res.json({ message: "success", status: truck.status }));
}

export default authMiddleware(handler);

async function disconnectProduct(status: TruckAvailability, truckName: string) {
  return (
    status === "Empty" &&
    (await prisma.trucks
      .update({
        where: {
          truckName,
          assignedProducts: { some: { status: "Rejected" } },
        },
        data: {
          assignedProducts: { disconnect: { truckName } },
        },
      })
      .then((v) => console.log(v))
      .catch((e) => console.log(e)))
  );
}
