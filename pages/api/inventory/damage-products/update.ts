import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { damageBins } from "@prisma/client";
// import { DamageProductInfo } from "@/components/Inventory/BinInventorySkwak";
import { MoveDamageForm } from "@/components/Inventory/BinInventory";

type DamageForm = Pick<MoveDamageForm, "binId" | "quantity" | "PO">;

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  console.log("moving damage product into inventory");
  const damageProductForm: DamageForm = req.body;
  const { binId, quantity, PO } = damageProductForm;

  console.log(damageProductForm);

  if (!Object.values(damageProductForm).every(Boolean))
    return res.status(404).json("Incomplete Field");
  const productIds = await prisma.assignedProducts // take all the necessary ids
    .findMany({
      where: {
        binId,
        purchaseOrder: PO,
        quality: "Good",
        status: "Default",
        damageBinsId: { isSet: false },
      },
      select: { id: true },
      take: quantity,
    })
    .then((products) => {
      console.log(products);
      return products.map((product) => product.id);
    });

  const bin = await prisma.bins.findFirst({ where: { id: binId } });
  console.log("bin", bin);

  const test = await prisma.assignedProducts.findMany({
    where: {
      purchaseOrder: PO,
      quality: "Good",
      status: "Default",
      damageBinsId: { isSet: false },
    },
  });

  const damageBin = await prisma.damageBins.findFirst({
    where: {
      category: "INVENTORY DAMAGE",
      OR: [
        {
          binId,
        },
        {
          assignedProducts: {
            every: { binId },
          },
        },
        { assignedProducts: { none: {} } },
      ],
    },
    orderBy: [{ row: "asc" }, { shelf: "asc" }],
  });
  const updateProduct = await prisma.assignedProducts
    .updateMany({
      where: { id: { in: productIds } },
      data: {
        damageBinsId: damageBin?.id,
        quality: "Damage",
        status: "Rejected",
      },
    })
    .catch((e) => console.log(e));

  const updateDamageBins = await prisma.damageBins.update({
    where: { id: damageBin?.id },
    data: { binId },
  });
  // console.log(updateProduct);
  return res.json({ updateProduct, updateDamageBins });
}

export default authMiddleware(handler);
