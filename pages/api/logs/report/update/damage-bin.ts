import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import prisma from "@/lib/prisma";
import { DamageBinButton } from "@/components/Inventory/DamageInventory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  console.log(req.body);
  const { action, id }: DamageBinButton = req.body;
  if (action === "default") {
    return res.json("Empty Action");
  }

  const updatedDamageBin = await prisma.damageBins.update({
    where: { id },
    data: { action },
  });

  return res.status(200).json(action);
}
