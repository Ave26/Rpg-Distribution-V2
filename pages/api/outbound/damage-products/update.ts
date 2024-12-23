import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { damageBins } from "@prisma/client";
import { DamageProductInfo } from "@/components/Inventory/BinInventorySkwak";
import { MoveDamageForm } from "@/components/Inventory/BinInventory";
import { ReportDamageProduct } from "@/components/PickingAndPackingRole/StaffUI/RecordsView";

type DamageForm = Pick<MoveDamageForm, "binId" | "quantity" | "PO">;

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  console.log("reporting damage product and put into inventory");
  const userId = verifiedToken.id;
  // check if the truck has been occupied

  const { SO, ids, truckId }: { ids: string[]; SO: string; truckId: string } =
    req.body;

  try {
    const checkTruck = await prisma.trucks.findUnique({
      where: { id: truckId, status: "InTransit", driverId: { isSet: true } },
      select: { status: true },
    });

    console.log(checkTruck);

    if (!checkTruck)
      return res
        .status(404)
        .json({ message: "Start Deliver Has Not Been Initiated!" });

    // find available damage bin
    const db = await prisma.damageBins.findFirst({
      where: {
        category: "OUTBOUND DAMAGE",
        OR: [
          {
            SO,
          },
          { assignedProducts: { none: {} } },
        ],
      },
      orderBy: [{ row: "asc" }, { shelf: "asc" }],
    });
    console.log(db);

    const updatedP = await prisma.assignedProducts.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "Rejected",
        version: { increment: 1 },
        quality: "Damage",
        damageBinsId: db?.id,
      },
    });

    console.log(updatedP);

    const updateDamageBin = await prisma.damageBins.update({
      where: { id: db?.id },
      data: { SO, action: "For Return Home" },
    });

    console.log(updateDamageBin, updatedP);
    return (
      updatedP &&
      updateDamageBin &&
      res.status(200).json({ message: "Success" })
    );
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
}

export default authMiddleware(handler);
