import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { getId } from "@/helper/_helper";
import prisma from "@/lib/prisma";
import { TForm } from "@/components/DeliveryMangement/deliveryManagementTypes";

type TBody = {
  form: TForm;
};

export default authMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { form }: TBody = req.body;
  console.log(form);
  try {
    switch (req.method) {
      case "POST":
        if (!Object.values(form).every(Boolean)) {
          return res.json({ message: "Incomplete Field" });
        }

        const truckFound = await prisma.trucks.findUnique({
          where: { truckName: form.truckName },
          select: { truckName: true },
        });

        if (truckFound) {
          return res
            .status(403)
            .json({ message: "Truck Already Exists", truckFound });
        }

        const addedTruck = await prisma.trucks.create({
          data: form,
        });

        return res.json({ message: "Truck Added", addedTruck });

      default:
        break;
    }
  } catch (error) {
    return res.json(error);
  }
});

// const { userId } = getId(verifiedToken);
// const trucks = await prisma.trucks.findMany({});
// const newName = trucks?.length + 1;

// await prisma.trucks.create({
//   data: {
//     name: `truck#${newName}`,
//     capacity,
//     routeCluster,
//   },
// });
// const updatedTrucks = await prisma.trucks.findMany({});

// return res.status(200).json(updatedTrucks);
