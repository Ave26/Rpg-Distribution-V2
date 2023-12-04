import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { bins } from "@prisma/client";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  switch (req.method) {
    case "GET":
      try {
        let sortedBins: bins[] = [];

        const categories = await prisma.categories.findMany({
          include: {
            racks: {
              include: {
                bins: {
                  include: {
                    _count: {
                      select: {
                        assignedProducts: true,
                      },
                    },
                    assignedProducts: {
                      select: {
                        purchaseOrder: true,
                        skuCode: true,
                        dateReceive: true,
                        expirationDate: true,
                        quality: true,
                        status: true,
                        barcodeId: true,
                        products: {
                          select: {
                            category: true,
                            productName: true,
                          },
                        },
                      },
                    },
                    racks: {
                      include: {
                        categories: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        for (let category of categories) {
          for (let rack of category.racks) {
            sortedBins = sortedBins.concat(rack.bins);
          }
        }

        // Now, newBins contains all bins from different categories and racks
        console.log(sortedBins);

        return res.status(200).json(sortedBins);
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
