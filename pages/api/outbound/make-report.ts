import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { EntriesTypes } from "@/types/binEntries";
import {
  selectAndUpdateBinByQuantity,
  selectBin,
  markAssignmentByBins,
} from "@/lib/prisma/bin";
import { JwtPayload } from "jsonwebtoken";
import { make_log_report } from "@/lib/prisma/report";
import { OrderReport } from "@prisma/client";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { productEntry }: { productEntry: EntriesTypes[] } = req.body;
  switch (req.method) {
    case "POST":
      try {
        let userId: string = "";
        if (verifiedToken && typeof verifiedToken === "object") {
          userId = verifiedToken.id; // Assign the userId from the token
        }
        console.log("productEntry", productEntry);
        const { error, report } = await make_log_report(productEntry, userId);

        return report
          ? res.status(200).json({ report, message: "Report Created" })
          : res.status(500).json(error);
      } catch (error) {
        return console.log(error);
      }

    case "GET":
      try {
        return res.send("Report Created");
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}
// lets manipulate the database
export default authMiddleware(handler);
