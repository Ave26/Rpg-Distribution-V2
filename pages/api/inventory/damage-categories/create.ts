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
  const existingCategory = await prisma.damageCategories
    .findUniqueOrThrow({
      where: { category },
    })
    .catch((e) => {
      console.log(e);
    });

  if (existingCategory) {
    return res.status(400).json({ error: "Category already exists" });
  }

  if (!category) {
    return res.status(404).json({ message: "Empty Field" });
  }

  const damageBin = await prisma.damageCategories
    .create({
      data: { category },
      select: { category: true },
    })
    .catch((e) => {
      console.error(e);
      return res.json(e);
    });

  return res.status(200).json(damageBin);
}

export default authMiddleware(handler);
