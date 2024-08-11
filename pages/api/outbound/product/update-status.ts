import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { TRequest } from "@/components/DeliveryMangement/Driver/DeliverButton";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { data, truckId }: TRequest = req.body;
  console.log(data, truckId);

  switch (req.method) {
    case "POST":
      try {
        const udpatedTruckAndProduct = await prisma.trucks.update({
          where: { id: truckId, status: "InTransit" },
          data: {
            payloadCapacity: {
              increment: data.total,
            },
            assignedProducts: {
              updateMany: {
                where: { binLocationsId: { in: data.binLocationIds } },
                data: { status: "Delivered" },
              },
            },
          },
          select: { assignedProducts: true },
        });

        return res.status(200).send(udpatedTruckAndProduct);
      } catch (error) {
        return res.send(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
