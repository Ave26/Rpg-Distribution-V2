import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type TBody = {
  searchSomething: string;
};

type TKeys = {
  barcodeId?: string;
  skuCode?: string;
  products?: {
    productName?: string;
  };
};



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { searchSomething }: TBody = req.body;

    const bins = await prisma.bins.findMany({
      where: searchSomething
        ? {
            assignedProducts: {
              some: {
                OR: [
                  { barcodeId: searchSomething || undefined },
                  { skuCode: searchSomething || undefined },
                ],
              },
            },
          }
        : {},

      select: {
        row: true,
        shelfLevel: true,
        id: true,
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
          take: 1,
          select: {
            barcodeId: true,
            skuCode: true,
            status: true,
            // expirationDate: true,
            sku: {
              select: {
                weight: true,
              },
            },
            products: {
              select: {
                category: true,
                productName: true,
                price: true,
              },
            },
          },
        },
      },
    });

    // console.log(bins);

    /* 
        barcodeId: "",
      truck: String(trucks[0]?.name),
      destination: "",
      clientName: "",
      productName: "",
      quantity: 0,
      purchaseOrderOutbound: "",
      truckCargo: 0,

      */

    const filteredBins = bins?.filter((bin) => {
      return bin._count.assignedProducts > 0;
    });

    // console.log(filteredBins);

    return res.status(200).json(filteredBins);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
}
