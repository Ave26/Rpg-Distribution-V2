import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware } from "../authMiddleware";
import prisma from "@/lib/prisma";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const role: string = req.body;
  console.log(role);

  const existingRole = await prisma.userRoles.findUnique({
    where: { role: role.toUpperCase() },
  });

  if (existingRole) {
    return res.json("Role Already Created");
  }

  await prisma.userRoles.create({
    data: { role: role.toUpperCase() },
  });

  return res.json("Role Created Successfully");
}

export default authMiddleware(handler);
