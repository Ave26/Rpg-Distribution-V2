import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { TUpdateTruckStatus } from "@/components/PickingAndPackingRole/StaffUI/UpdateTruckStatus";
import prisma from "@/lib/prisma";
import { Coordinates, TruckAvailability, trucks } from "@prisma/client";
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
  console.log(req.body);

  const { binLocationIds, total } = productData;
  console.log(binLocationIds);
  console.log(truckId, status, truckName, coordinates, total);
  console.log(req.body);
  switch (req.method) {
    case "POST":
      try {
        const userId = verifiedToken.id; // driver
        const assignedProducts = await prisma.assignedProducts.findMany({
          where: { truckName, quality: "Good" },
          select: { status: true },
        });

        // console.log(assignedProducts);

        const checkProductStatus = assignedProducts.every(
          (product) => product.status === "Delivered"
        );

        // console.log(checkProductStatus);

        if (!checkProductStatus && status === "Delivered") {
          return res.status(401).json({
            message: "All the products has not been delivered yet",
          });
        }
        const data: Record<string, any> = {
          driverId: status === "Empty" ? { unset: true } : userId,
          status:
            status === "Delivered" && checkProductStatus ? "Delivered" : status,
          deliveryLogs: {
            create: {
              status,
              driverId: userId,
              timeStamp: new Date(),
              coordinates,
            },
          },
        };

        let newData = { ...data };

        if (status === "Empty") {
          newData = {
            ...newData,
            payloadCapacity: 3500,
          };
        }
        console.log(data);
        console.log(newData);

        const updatedTruck = await prisma.trucks.update({
          where: { id: truckId },
          data: {
            ...newData,
            assignedProducts: {
              updateMany: {
                where: {
                  binLocationsId: { in: binLocationIds },
                  status: "Loaded",
                },
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

        // console.log(updatedTruck);
        await disconnectProduct(status, updatedTruck?.truckName); // status: empty,  disconnect product

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
