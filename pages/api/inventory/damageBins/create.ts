import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { DamageBin } from "@/components/PalleteLocation/DamageBin";
import { Prisma } from "@prisma/client";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { binQuantity, shelf, category }: DamageBin = req.body;
  if (!binQuantity || !shelf || category === "default") {
    console.log(req.body);
    return res.status(404).json("Incomplete Field");
  }

  const data = Array.from({ length: binQuantity }, (_, i) => i + 1).flatMap(
    (i) =>
      Array.from(
        { length: shelf },
        (_, index): Prisma.damageBinsCreateManyInput => ({
          row: i,
          shelf: index + 1,
          category,
          action: "",
        })
      )
  );

  await prisma.damageBins
    .createMany({ data })
    .then(() => res.json({ message: "Damage Bin Created" }))
    .catch((e) => res.json(e));
}

export default authMiddleware(handler);
