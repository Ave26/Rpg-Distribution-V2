import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const binLogReport = await prisma.binLogReport
    .findMany({
      distinct: "rackName",
      where: {
        // category, // Filter by category
        // rackName, // Filter by rackName
      },

      orderBy: {
        timeStamp: "desc", // Ensure you get the most recent update
      },
    })
    .catch((e) => res.json(e));

  return res.status(200).json(binLogReport);
}

/* display the product if log is = ["MODERATE, "CRITICAL"] AND TIME STAMP IS GREATER THAN OR EQUAL TO TIME */
