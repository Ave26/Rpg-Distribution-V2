import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import {
  TUpdateTruckData,
  TUpdateTrucks,
} from "@/components/PickingAndPackingRole/StaffUI/LoadRecordButton";
import prisma from "@/lib/prisma";
// import { update_order } from "@/lib/prisma/order";

type TBody = {
  orderId: string;
};

type TIncludeAssignedProductIds = TUpdateTruckData & {
  assignedProductIds: string[];
  truckId: string;
};
export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & { roles: UserRole; id: string }
) {
  const { assignedProductIds, capacity, status, truckId }: TUpdateTrucks =
    req.body;

  switch (req.method) {
    case "POST":
      try {
        // await update_order(orderId);
        // return res.status(200).json({
        //   message: "Loaded On Truck",
        // });\

        const updateTruck = await prisma.trucks.update({
          where: { id: truckId },
          data: { status, payloadCapacity: capacity },
        });

        const updateAssignedProducts = await prisma.assignedProducts.updateMany(
          {
            where: { id: { in: assignedProductIds } },
            data: { status: "Loaded", truckName: updateTruck.truckName },
          }
        );

        return res.send({
          message: "order updated",
          updateTruck,
          updateAssignedProducts,
        });
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
