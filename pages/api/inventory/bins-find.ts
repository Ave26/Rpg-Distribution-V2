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
        let sortedBins = [];

        const categories = await prisma.categories.findMany({
          include: { racks: { include: { bins: true } } },
          // include: {
          //   racks: {
          //     include: {
          //       bins: {
          //         include: {
          //           _count: {
          //             select: {
          //               assignedProducts: true,
          //             },
          //           },
          //           assignedProducts: {
          //             select: {
          //               id: true,
          //               purchaseOrder: true,
          //               skuCode: true,
          //               dateReceive: true,
          //               expirationDate: true,
          //               quality: true,
          //               status: true,
          //               barcodeId: true,
          //               products: {
          //                 select: {
          //                   category: true,
          //                   productName: true,
          //                 },
          //               },
          //             },
          //           },
          //           racks: {
          //             include: {
          //               categories: true,
          //             },
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
        });

        // // Extract pagination parameters from query string
        // const page = parseInt(req.query.page as string) || 1;
        // const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 4;

        // // Calculate start and end indices for the current page
        // const startIndex = (page - 1) * itemsPerPage;
        // const endIndex = startIndex + itemsPerPage;

        // for (let category of categories) {
        //   for (let rack of category.racks) {
        //     const uniquePO = new Set();
        //     for (let bin of rack.bins) {
        //       uniquePO.add(bin?.assignedProducts);
        //     }
        //     // console.log(uniquePO);
        //     sortedBins.push(...rack.bins);
        //   }
        // }

        // // Use slice to extract bins for the current page
        // const currentPageBins = sortedBins.slice(startIndex, endIndex);

        // const totalBins = sortedBins.length;

        // // Calculate the last page
        // const lastPage = Math.ceil(totalBins / itemsPerPage);

        return res.status(200).json(categories);
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);

// Extract distinct assignedProducts based on purchase order
// const distinctAssignedProducts = currentPageBins
//   .flatMap((bin) => bin.assignedProducts)
//   .filter((product, index, self) => {
//     return (
//       index ===
//       self.findIndex((p) => p.purchaseOrder === product.purchaseOrder)
//     );
//   });

// Now, distinctAssignedProducts contains assignedProducts with unique purchaseOrder
// console.log(distinctAssignedProducts);

// Calculate the total number of bins
