import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { TFormExtend } from "@/components/DeliveryMangement/deliveryManagementTypes";
import { UserRole } from "@prisma/client";

type TBody = { form: TFormExtend; id: string };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & { roles: UserRole; id: string }
) {
  const { form, id }: TBody = req.body;
  const { status, ...rest } = form;
  try {
    switch (req.method) {
      case "PATCH":
        if (!Object.values(rest).some(Boolean)) {
          return res.status(200).send({ message: "Empty Fields" });
        }

        const dataToUpdate: Record<string, number | string> = {
          truckName: rest.truckName,
          plate: rest.plate,
          payloadCapacity: rest.payloadCapacity,
        };

        const filteredData: Record<string, number | string> = {};
        Object.entries(dataToUpdate).forEach(([key, value]) => {
          if (value) {
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

        return res
          .status(200)
          .json({ updatedTruck, message: "Product Updated" });

      default:
        return res.send(`Method ${req.method} is not allowed`);
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
