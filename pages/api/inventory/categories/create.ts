import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";

import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  console.log("creating bin category...");
  const category = req.body;

  if (!category) {
    return res.status(404).json({ message: "Empty Field" });
  }

  const existingCategory = await prisma.categories
    .findUniqueOrThrow({
      where: { category },
    })
    .catch((e) => {
      console.log(e);
      console.log(e);
    });

  if (existingCategory) {
    return res.status(400).json({ error: "Category already exists" });
  }

  const categories = await prisma.categories
    .create({
      data: { category },
      select: { category: true, _count: { select: { bins: true } } },
    })
    .catch((e) => {
      console.error(e);
      return res.json(e);
    });

  console.log(categories);
  return res.status(200).json(categories);
}

export default authMiddleware(handler);
