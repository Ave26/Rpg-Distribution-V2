import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface Body {
  productData: {
    totalNetW: number;
    productIds: string[];
  };
  truckId: string;
}

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { productData, truckId }: Body = req.body;
  const { productIds, totalNetW } = productData;
  console.log(req.body);

  await prisma.trucks
    .update({
      where: { id: truckId, status: "InTransit" },
      data: {
        payloadCapacity: {
          increment: totalNetW,
        },
        assignedProducts: {
          updateMany: {
            where: { id: { in: productIds } },
            data: { status: "Delivered" },
          },
        },
      },
    })
    .then((truckAndProductStatus) => {
      console.log(truckAndProductStatus);
      return (
        truckAndProductStatus &&
        res.status(200).json({ message: "Product Updated" })
      );
    })
    .catch((e) => {
      console.log(e);
      return res.status(404).json({
        message: "The Truck Should Be In Transit",
      });
    });
}

export default authMiddleware(handler);
