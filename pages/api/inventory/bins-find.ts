import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { assignedProducts, bins, racks } from "@prisma/client";

type TBins = bins & {
  assignedProducts: assignedProducts[];
  racks: racks;
  _count: {
    assignedProducts: number;
  };
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  switch (req.method) {
    case "GET":
      try {
        const categories = await prisma.categories.findMany({
          include: {
            racks: {
              include: {
                bins: {
                  include: {
                    _count: {
                      select: {
                        assignedProducts: {
                          where: { status: { not: "Delivered" } },
                        },
                      },
                    },
                    assignedProducts: {
                      where: { status: { not: "Delivered" } },
                      select: {
                        id: true,
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
                      take: 1,
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

        return res.status(200).json(categories);
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
