import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { authMiddleware } from "../../authMiddleware";
import { UserRole, binLocations } from "@prisma/client";
import {
  TBinLocations,
  TOrderedProductTest,
} from "@/components/PickingAndPackingRole/AdminUI/Admin";
import { TRecord } from "@/components/PickingAndPackingRole/AdminUI/AdminRecordForm";

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
        const id = verifiedToken.id;
        const { orderedProducts, record }: TBody = req.body;
        const orderedProductslength = orderedProducts.length;
        const { POO, clientName, locationName, truckName } = record;

        const everyRecordIsEmpty = !Object.values(record).every(
          (value) => value !== "default" && Boolean(value)
        );
        const orderedProductsIsEmpty = orderedProductslength === 0;

        if (everyRecordIsEmpty || orderedProductsIsEmpty) {
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

        const createdRecord = await prisma.records.create({
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
            orderedProductsTest: { include: { binLocations: true } },
          },
        });

        const binLocations = await prisma.binLocations.findMany({
          where: { assignedProducts: { none: {} } },
        });

        binLocations.map(async (binLocation) => {
          const { binId, quantity, id } = binLocation;

          const assignedProduct = await prisma.assignedProducts.findMany({
            where: {
              status: "Default",
              binId,
              binLocationsId: { isSet: false },
            },
            take: quantity,
            select: { id: true },
          });

          console.log(assignedProduct);

          const updateAssignedProductIds = assignedProduct.map((p) => p.id);

          const product = await prisma.assignedProducts.updateMany({
            where: { id: { in: updateAssignedProductIds } },
            data: { status: "Queuing", binLocationsId: id },
          });

          console.log(product);
        });

        console.log(binLocations);

        return res
          .status(200)
          .json({ message: "create record working", createdRecord });
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
}

export default authMiddleware(handler);

// How do I change the assignedProducts status into queue

/* 
       async function updateAssignedProducts(binLocations: binLocations[]) {
          await binLocations.reduce(async (previousPromise, bin) => {
            await previousPromise;
            const { id, quantity, binId } = bin;

            const assignedProducts = await prisma.assignedProducts.findMany({
              where: { binId, status: "Default", binLocationsId: null },
              select: { id: true },
              take: quantity,
            });

            const assignedProductIds = assignedProducts.map(
              (assignedProduct) => assignedProduct.id
            );
            await prisma.assignedProducts.updateMany({
              where: {
                id: { in: assignedProductIds },
              },
              data: {
                binLocationsId: { set: id },
                status: "Queuing",
              },
            });
          }, Promise.resolve());
        }

        // Usage: Updating Status and connecting the binLocationId to AssignedProducts
        const binsLocations = await prisma.binLocations.findMany({
          where: { assignedProducts: { none: {} } },
          include: { assignedProducts: true },
        });

          console.log(binsLocations);
        await updateAssignedProducts(binsLocations);


*/
