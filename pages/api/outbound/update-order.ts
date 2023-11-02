import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { update_order } from "@/lib/prisma/order";

type TBody = {
  orderId: string;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { orderId }: TBody = req.body;
  switch (req.method) {
    case "POST":
      try {
        await update_order(orderId);
        return res.status(200).json({
          message: "Order Updated",
        });
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
