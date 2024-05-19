import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { TUpdateTruckData } from "@/components/PickingAndPackingRole/StaffUI/LoadRecordButton";
import { UserRole } from "@prisma/client";
import { TUpdateTruckStatus } from "@/components/PickingAndPackingRole/StaffUI/UpdateTruckStatus";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & { roles: UserRole; id: string }
) {
  const { status, truckId }: TUpdateTruckStatus = req.body;

  switch (req.method) {
    case "POST":
      try {
        console.log(truckId, status);
        const userId = verifiedToken.id;
        const updateTruck = await prisma.trucks.update({
          where: { id: truckId },
          data: { driverId: userId },
          select: {
            truckName: true,
            assignedProducts: { select: { id: true } },
          },
        });

        // const assignedProductIds = updateTruck.assignedProducts.map(
        //   (assignedProduct) => assignedProduct.id
        // );

        // const updateAssginedProducts = await prisma.assignedProducts.updateMany(
        //   {
        //     where: {
        //       truckName: updateTruck.truckName,
        //       id: { in: assignedProductIds },
        //     },
        //     data: { status: "OutForDelivery" },
        //   }
        // );

        // console.log("updateAssginedProducts", updateAssginedProducts);
        // return res
        //   .status(200)
        //   .json({ truckId, status, updateAssginedProducts });
      } catch (error) {
        return res.send(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
