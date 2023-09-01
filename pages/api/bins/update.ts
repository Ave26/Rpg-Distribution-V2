import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import {
  selectAndUpdateBinByQuantity,
  selectBin,
  markAssignmentByBins,
} from "@/lib/prisma/bin";
import { JwtPayload } from "jsonwebtoken";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { barcodeId, quantity, selectedBinIds } = req.body;

  console.log(barcodeId, quantity, selectedBinIds);
  switch (req.method) {
    case "POST":
      try {
        // const { message } = await updateSelectedBin(binId);
        let userId: string | undefined;
        if (verifiedToken && typeof verifiedToken === "object") {
          userId = verifiedToken.id; // Assign the userId from the token
        }

        const { markedAssignments } = await markAssignmentByBins(
          barcodeId,
          quantity,
          selectedBinIds
        );

        console.log(userId);
        return res
          .status(200)
          .json({ markedAssignments, messsage: "Assignments has been marked" });
      } catch (error) {
        return res.json(error);
      }

    default:
      res.send(`${req.method} is not allows`);
      break;
  }
}

export default authMiddleware(handler);
