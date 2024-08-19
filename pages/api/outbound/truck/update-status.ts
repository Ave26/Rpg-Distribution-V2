import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { TUpdateTruckStatus } from "@/components/PickingAndPackingRole/StaffUI/UpdateTruckStatus";
import prisma from "@/lib/prisma";
import { Coordinates, TruckAvailability } from "@prisma/client";
import { ProductData } from "../product/update-status";

export interface Truck {
  truckId: string;
  status: TruckAvailability;
  truckName: string;
  coordinates: Coordinates;
}

export type TruckExtendsProduct = Truck & {
  productData: ProductData;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const {
    status,
    truckId,
    truckName,
    coordinates,
    productData,
  }: TruckExtendsProduct = req.body;

  const { binLocationIds, total } = productData;
  console.log(truckId, status, truckName, coordinates);
  console.log(req.body);
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
            assignedProducts: {
              updateMany: {
                where: { binLocationsId: { in: binLocationIds } },
                data: { status: "OutForDelivery" },
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
