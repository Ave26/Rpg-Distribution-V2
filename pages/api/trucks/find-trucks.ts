import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { getId } from "@/helper/_helper";
import prisma from "@/lib/prisma";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  try {
    switch (req.method) {
      case "GET":
        const trucks = await prisma.trucks.findMany({
          include: {
            records: {
              include: {
                orderedProducts: {
                  where: {
                    assignedProducts: {
                      every: {
                        status: "Loaded",
                      },
                    },
                  },
                },
              },
            },
          },
        });

        console.log(trucks);

        // const assingedProduct = await prisma.bins.findMany({
        //   include: {
        //     assignedProducts: true,
        //   },
        // });

        // console.log(assingedProduct);
        const { userId } = getId(verifiedToken);
        return res.status(200).json(trucks);

      default:
        return res.send(`Method ${req.method} is not allowed`);
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
