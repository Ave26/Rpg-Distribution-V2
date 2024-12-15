import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const category = req.body;
  console.log(category);
  await prisma.categories
    .delete({
      where: { category },
    })
    .then(() => {
      return res.json({ message: "deleted" });
    })
    .catch((e) => {
      console.error(e);
      return res.json(e);
    });
}

export default authMiddleware(handler);
