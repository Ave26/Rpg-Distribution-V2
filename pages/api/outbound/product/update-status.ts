import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export type ProductData = { binLocationIds?: string[]; total?: number };

export type UpdateProduct = {
  truckId: string;
  productData: ProductData;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { productData, truckId }: UpdateProduct = req.body;
  const { binLocationIds, total } = productData;

  console.log(req.body);
  //  need to create new api for updating the truch status as well as the product status depending on what the truck status
  switch (req.method) {
    case "POST":
      try {
        const udpatedTruckAndProduct = await prisma.trucks.update({
          where: { id: truckId, status: "InTransit" },
          data: {
            payloadCapacity: {
              increment: total,
            },
            assignedProducts: {
              updateMany: {
                where: { binLocationsId: { in: binLocationIds } },
                data: { status: "Delivered" },
              },
            },
          },
          select: { assignedProducts: true },
        });

        console.log(udpatedTruckAndProduct);

        return res.status(200).json({ message: `${udpatedTruckAndProduct}` });
      } catch (error) {
        console.log(error);
        return res.send(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
