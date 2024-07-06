import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { TUpdateTrucks } from "@/components/PickingAndPackingRole/StaffUI/LoadRecordButton";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & { roles: UserRole; id: string }
) {
  const { assignedProductIds, total, status, truckId }: TUpdateTrucks =
    req.body;

  switch (req.method) {
    case "POST":
      try {
        const truck = await prisma.trucks.findUnique({
          where: { id: truckId },
        });

        const assignedProducts = await prisma.assignedProducts.findMany({
          where: { id: { in: assignedProductIds } },
          select: { version: true, id: true },
        });

        prisma.$transaction(async (prisma) => {
          const updateTruck = await prisma.trucks.update({
            where: { id: truckId, version: truck?.version },
            data: {
              status,
              payloadCapacity: { decrement: total },
              version: { increment: 1 },
            },
            select: { truckName: true },
          });
          console.log(updateTruck);

          const updateAssingedProducts = assignedProducts.map(
            async (product) => {
              await prisma.assignedProducts.update({
                where: {
                  id: product.id,
                  version: product.version,
                },
                data: {
                  status: "Loaded",
                  truckName: updateTruck.truckName,
                  version: { increment: 1 },
                },
              });
            }
          );
          const data = await Promise.all(updateAssingedProducts);
          console.log(data);
        });

        return res.json({
          message: "Transaction completed successfully.",
        });
      } catch (error) {
        console.error("Error during transaction:", error);
        return res.json({ message: "Error during transaction:", error });
      }
    default:
      break;
  }
}

export default authMiddleware(handler);

/* 
  Key Points
  Optimistic Concurrency Control (OCC):
      We use a version field to detect changes to a record and prevent race conditions.
      The version field should be initialized with a default value in the Prisma schema.
  Atomic Operations:
      Atomic operations like increment and decrement ensure that updates are performed atomically.
  Transactions:
      Transactions ensure that a group of database operations is executed atomically, maintaining data consistency.
      We use prisma.$transaction to wrap multiple operations in a single transaction.
  Error Handling:
      Proper error handling is essential to catch and log any issues that occur during the transaction.
*/
