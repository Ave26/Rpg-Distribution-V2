import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { sortProductBins } from "@/lib/prisma/inventory";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { initiate }: { initiate: boolean } = req.body;
  switch (req.method) {
    case "POST":
      try {
        /* 
          
            AS OF NOW 5 - 19 -34 PRODUCT SORT IS DANGEROUS
          */

        const qeuedProducts = await prisma.assignedProducts.findFirst({
          where: {
            status: "Queuing",
          },
        });

        if (qeuedProducts) {
          return res.status(403).json({
            message:
              "There are products in queuing, please complete the process",
          });
        }

        const { updatedProducts } = await sortProductBins();

        return (
          updatedProducts &&
          res.status(200).json({ message: "Bin has now been sorted" })
        );
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
