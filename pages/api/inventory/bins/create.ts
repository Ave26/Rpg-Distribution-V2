// for creating bins
import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Bin } from "@/components/PalleteLocation/Bin";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { binQuantity, shelf, category, rackName }: Bin = req.body;
  if (!binQuantity || !shelf || category === "default") {
    console.log(req.body);
    return res.status(404).json("Incomplete Field");
  }

  const capacityField: Record<number, number> = {
    1: 100,
    2: 100,
    3: 70,
    4: 50,
  };

  const data = Array.from({ length: binQuantity }, (_, i) => i + 1).flatMap(
    (i) =>
      Array.from(
        { length: shelf },
        (_, index): Prisma.binsCreateManyInput => ({
          row: i,
          shelfLevel: index + 1,
          category,
          rackName,
          capacity: capacityField[index + 1] ?? 50, // based on the shelf level
        })
      )
  );

  await prisma.bins
    .createMany({ data })
    .then(() => res.json({ message: "Damage Bin Created" }))
    .catch((e) => res.json(e));
}

export default authMiddleware(handler); // as og now this test is not broken
