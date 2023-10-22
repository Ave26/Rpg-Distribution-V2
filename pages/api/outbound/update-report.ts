import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { updateReport } from "@/lib/prisma/report";
import { error } from "console";

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
        const { updatedProducts, error } = await updateReport(orderId);
        if (!updatedProducts || error) {
          return res.status(500).json({
            message: "Product Has Not Been Loading",
          });
        }
        return res.status(200).json({
          message: `Product has been loaded`,
        });
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
