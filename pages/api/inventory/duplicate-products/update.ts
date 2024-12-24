import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { damageBins } from "@prisma/client";
import { DamageProductInfo } from "@/components/Inventory/BinInventorySkwak";
import { MoveDamageForm } from "@/components/Inventory/BinInventory";

export type DuplicateForm = Pick<MoveDamageForm, "binId" | "quantity" | "PO">;

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { PO, binId, quantity }: DuplicateForm = req.body;
  console.log(req.body);
  // mark products to be duplicate

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
  const updateProduct = await prisma.assignedProducts.updateMany({
    where: { binId, purchaseOrder: PO, id: { in: productIds } },
    data: { quality: "Duplicate" },
  });
  console.log(updateProduct);
  return res.json(updateProduct);
}

export default authMiddleware(handler);
