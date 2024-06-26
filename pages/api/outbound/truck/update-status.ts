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
  const { status, truckId, truckName, coordinates }: TUpdateTruckStatus =
    req.body;
  console.log(truckId, status, truckName, coordinates);

  switch (req.method) {
    case "POST":
      try {
        const userId = verifiedToken.id; // driver
        // const { latitude, longitude } = coordinates;
        // if (status && truckId && truckName && latitude && longitude) {
        //   return res.status(404).json({ message: "Incomplete Field" });
        // }

        const assignedProducts = await prisma.assignedProducts.findMany({
          where: { truckName },
          select: { status: true },
        });

        const checkProductStatus = assignedProducts.every(
          (product) => product.status === "Delivered"
        );

        if (!checkProductStatus && status === "Delivered") {
          return res.status(401).json({
            message: "All the products has not been delivered yet",
          });
        }

        const updatedTruck = await prisma.trucks.update({
          where: { id: truckId },
          data: {
            driverId: status === "Empty" ? { unset: true } : userId, // unset the driver id if the status has now become empty
            status:
              status === "Delivered" && checkProductStatus
                ? "Delivered"
                : status,
            deliveryLogs: {
              create: {
                status,
                driverId: userId,
                timeStamp: new Date(),
                coordinates,
              },
            },
          },
          select: {
            truckName: true,
            _count: true,
            status: true,
            driverId: true,
            id: true,
          },
        });

        console.log(updatedTruck);

        // const { driverId, id, status: sts } = updatedTruck;

        // if (updatedTruck) {
        //   await prisma.deliveryLogs.create({
        //     data: {
        //       status: sts,
        //       driverId: driverId || userId,
        //       trucksId: id,
        //       timeStamp: new Date(),
        //       locations: {
        //         create: {
        //           coordinates: { longitude: 0, latitude: 0 },
        //           name: "",
        //         },
        //       },
        //     },
        //   });
        // }

        /* 
          if got an emergenct stop then the changes of the truck status will be commit.
          
        */

        return res
          .status(200)
          .json({ message: "Update Succesfull", updatedTruck });
      } catch (error) {
        return res.send(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
