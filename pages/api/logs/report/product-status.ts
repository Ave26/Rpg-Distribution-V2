import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const productLogs = await prisma.product_status_log
    .findMany({
      distinct: "skuCode",
      orderBy: { timeStamp: "desc" },
      select: {
        skuCode: true,
        status: true,
        percentage: true,
        threshold: true,
        assignedProductCount: true,
        timeStamp: true,
      },
    })
    .then((logs) => {
      return logs.filter((v) => v.status !== "HEALTHY");
    })
    .catch((e) => console.log(e));

  return res.json(productLogs);
}

/* display the product if log is = ["MODERATE, "CRITICAL"] AND TIME STAMP IS GREATER THAN OR EQUAL TO TIME */
