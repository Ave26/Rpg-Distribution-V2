import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { authMiddleware } from "../../authMiddleware";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const result = await prisma.assignedProducts.groupBy({
    by: ["qualityAssuranceManagerId"],
    where: { qualityAssuranceManagerId: { isSet: true }, quality: "Duplicate" },
    _count: {
      _all: true,
    },
  });

  const userIds = result.map((item) => item.qualityAssuranceManagerId ?? "");

  const users = await prisma.users.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      username: true,
    },
  });

  const combinedResult = result.map((item) => ({
    count: item._count._all,
    username: users.find((user) => user.id === item.qualityAssuranceManagerId)
      ?.username,
  }));

  return res.json(combinedResult);
}
export default authMiddleware(handler);
