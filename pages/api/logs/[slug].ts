// this will be the dynamic api for logs
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Adjust path if needed
import { isValidSlug } from "@/features/log-overview";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (typeof slug !== "string" || !isValidSlug(slug)) {
    return res.status(400).json({ error: "Invalid slug" });
  }

  try {
    switch (slug) {
      case "order-queue":
        const orders = await prisma.records.findMany({
          where: {
            orderedProducts: {
              every: {
                binLocations: {
                  every: { assignedProducts: { some: { status: "Queuing" } } },
                },
              },
            },
          },
          include: {
            _count: { select: { orderedProducts: true } },
            orderedProducts: {
              include: {
                binLocations: {
                  select: {
                    stockKeepingUnit: { select: { weight: true } },
                    assignedProducts: {
                      where: { status: { in: ["Queuing", "Delivered"] } },
                      select: {
                        status: true,
                        barcodeId: true,
                      },
                      take: 1,
                    },
                    quantity: true,
                  },
                },
              },
            },
          },
        });
        console.log(orders);
        return res.status(200).json(orders);

      //   case "product-status":
      //     const status = await prisma.productStatus.findMany();
      //     return res.status(200).json(status);

      // Add more cases for each slug type...
      default:
        return res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error });
  }
}
