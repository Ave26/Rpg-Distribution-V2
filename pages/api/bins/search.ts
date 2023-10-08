import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type TBody = {
  searchSomething: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { searchSomething }: TBody = req.body;
    console.log(searchSomething);
    let whereCondition = {};
    if (searchSomething) {
      whereCondition = {
        assignedProducts: {
          some: {
            products: {
              OR: [
                { barcodeId: searchSomething || undefined },
                { productName: searchSomething || undefined },
                { sku: searchSomething || undefined },
              ].filter((condition) => condition !== undefined),
            },
          },
        },
      };
    }

    const bins = await prisma.bins.findMany({
      where: whereCondition,
      include: {
        _count: {
          select: {
            assignedProducts: {
              where: {
                status: "Default",
              },
            },
          },
        },
        assignedProducts: {
          where: {
            status: "Default",
          },
          select: {
            expirationDate: true,
            dateReceive: true,
            products: {
              select: {
                barcodeId: true,
                productName: true,
                sku: true,
                price: true,
              },
            },
          },
        },
        racks: {
          select: {
            name: true,
            categories: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    });

    const filteredBins = bins?.filter((bin) => {
      return Number(bin?.assignedProducts?.length) > 0;
    });

    return res.status(200).json(filteredBins);
  } catch (error) {
    return res.json(error);
  }
}
