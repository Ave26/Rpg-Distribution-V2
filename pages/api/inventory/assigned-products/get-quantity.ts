import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { damageBins } from "@prisma/client";

type Data = {
  PO: string;
  binId: string;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { PO, binId }: Data = req.body;
  console.log(PO);
  await prisma.bins
    .findFirst({
      where: { id: binId },

      select: {
        _count: {
          select: { assignedProducts: { where: { purchaseOrder: PO } } },
        },
      },
    })
    .then((bins) => {
      return res.status(200).json({ quantity: bins?._count.assignedProducts });
    })
    .catch((e) => res.json(e));
}

export default authMiddleware(handler);
