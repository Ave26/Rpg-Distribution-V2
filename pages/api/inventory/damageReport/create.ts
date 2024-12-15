import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { DamageBin } from "@/components/PalleteLocation/DamageBin";
import { Prisma } from "@prisma/client";
import { DamageBinButton } from "@/components/Inventory/DamageInventory";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const damageReport: DamageBinButton = req.body;
  console.log(damageReport);
  return res.send(damageReport);
}

export default authMiddleware(handler);
