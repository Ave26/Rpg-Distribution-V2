import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { authMiddleware } from "../../authMiddleware";
import { UserRole } from "@prisma/client";
import {
  TBinLocations,
  TOrderedProductTest,
} from "@/components/PickingAndPackingRole/AdminUI/Admin";
import { TRecord } from "@/components/PickingAndPackingRole/AdminUI/AdminRecordForm";
import { setTime } from "@/helper/_helper";

type TCreateOrderedProduct = {
  productName: string;
  binLocations: {
    createMany: {
      data: TBinLocations[];
    };
  };
};

type TBody = {
  record: TRecord;
  orderedProducts: TCreateOrderedProduct[];
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & { roles: UserRole; id: string }
) {
  try {
    switch (req.method) {
      case "POST":
        const { orderedProducts, record }: TBody = req.body;
        const { POO, clientName, locationName, truckName } = record;
        const id = verifiedToken.id;

        if (
          !Object.values(record).every(
            (value) => value !== "default" && Boolean(value)
          )
        ) {
          return res.status(405).json({ message: "Incomplete Field" });
        }

        const user = await prisma.users.findUnique({
          where: {
            id,
          },
        });

        const takeLast = await prisma.records.findFirst({
          where: { POO },
          select: { batchNumber: true },
          orderBy: { batchNumber: "desc" },
          take: 1,
        });

        const createRecord = await prisma.records.create({
          data: {
            clientName,
            POO,
            truckName,
            locationName,
            authorName: user?.username,
            dateCreated: new Date(),
            batchNumber: takeLast?.batchNumber && takeLast?.batchNumber + 1,
            orderedProductsTest: { create: orderedProducts },
          },
          include: {
            trucks: true,
            orderedProductsTest: true,
          },
        });

        return res.send({ message: "create record working", createRecord });
      // return res
      //   .status(500)
      //   .json({ message: `forbidden not a ${req.method}` });
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
}

export default authMiddleware(handler);

// I want to create a new array that can merge the two arrays
