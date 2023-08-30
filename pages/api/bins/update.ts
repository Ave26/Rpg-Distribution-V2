import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import {
  selectAndUpdateBinByQuantity,
  selectBin,
  markAssignmentByBins,
} from "@/lib/prisma/bin";
import { JwtPayload } from "jsonwebtoken";
import { VerifyToken } from "@/types/authTypes";
import { error } from "console";

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

        // await markAssignmentByBins();

        // const { selectedBin, error } = await selectBin(binId);
        // if (error) {
        //   return res.status(500).json({
        //     message: "Oops... there was an error problem",
        //   });
        // }
        // await selectAndUpdateBinByQuantity({
        //   selectedBins,
        //   quantity,
        //   userId,
        // });

        // return res.status(200).json(message);
        // return res.send(userId);
        console.log(userId);
        return res.status(200).json({ barcodeId, quantity, selectedBinIds });
      } catch (error) {
        return res.json(error);
      }

    default:
      res.send(`${req.method} is not allows`);
      break;
  }
}

export default authMiddleware(handler);
