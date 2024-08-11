import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { authMiddleware, UserToken } from "../../authMiddleware";
import { UserRole } from "@prisma/client";
import Products from "@/pages/products";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  try {
    switch (req.method) {
      case "GET":
        const products = await prisma.products.findMany({});
        console.log(Products);

        return res.send(products);

      default:
        return res
          .status(500)
          .json({ message: `${req.method} is not a forbidden` });
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
