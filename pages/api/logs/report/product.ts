import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

type TProducts = {
  assignedProducts: {
    sku: {
      threshold: number;
    };
  }[];
  _count: {
    assignedProducts: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  switch (req.method) {
    case "GET":
      try {
        /* taking the product that has been taken by the binslocation 
        count all the default products
        calculate if the products is in the verge of replenishment
        */

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Get the end of the day
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const products = await prisma.products.findMany({
          where: { assignedProducts: { some: { status: "Default" } } },
          select: {
            productName: true,
            _count: {
              select: {
                assignedProducts: {
                  where: { status: "Default" },
                },
              },
            },
            assignedProducts: {
              where: { status: "Default" },
              select: { sku: { select: { threshold: true } } },
              take: 1,
            },
          },
        });

        const result = setPrompt(products);
        // console.log(result);
        // console.log(products);

        return res.json(products);
      } catch (error) {
        return res.json(error);
      }
    default:
      break;
  }
}

// export default authMiddleware(handler);
interface TProductReport {
  productName: string;
  status: string;
  skuName: string;
  POO: string;
}

function setPrompt(products: TProducts[]) {
  // check the current quantity of the product
  // if it find the quantity is change then it need to calculated to define the status of each product
  // create a copy of the product and iterate it
  // someone must change the product status, to not stressout the 
}
