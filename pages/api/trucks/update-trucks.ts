import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { TFormExtend } from "@/components/DeliveryMangement/deliveryManagementTypes";
// import { UserRole } from "@prisma/client";

type TBody = { form: TFormExtend; id: string };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { form, id }: TBody = req.body;
  const { status, ...rest } = form;
  try {
    switch (req.method) {
      case "PATCH":
        if (!Object.values(rest).some(Boolean)) {
          return res.status(200).send({ message: "Empty Fields" });
        }

        // find the truckName if there is the same throw an error

        const truckFound = await prisma.trucks.findUnique({
          where: { truckName: rest.truckName },
        });

        const dataToUpdate: Record<string, number | string> = {
          truckName: rest.truckName,
          plate: rest.plate,
          payloadCapacity: rest.payloadCapacity,
        };

        const filteredData: Record<string, number | string> = {};
        Object.entries(dataToUpdate).forEach(([key, value]) => {
          if (value && (key !== "truckName" || !truckFound)) {
            filteredData[key] = value;
          }
        });

        const updatedTruck = await prisma.trucks.update({
          where: {
            id,
          },
          data: {
            status,
            ...filteredData,
          },
        });

        return res.status(200).json({
          updatedTruck,
          message: truckFound
            ? "Product Updated, Truck Name must be unique"
            : "Product Updated",
        });

      default:
        return res.send(`Method ${req.method} is not allowed`);
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
