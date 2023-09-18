// import { NextApiRequest, NextApiResponse } from "next";
// import { authMiddleware } from "../authMiddleware";

// export async function handler(res: NextApiResponse, req: NextApiRequest,  verifiedToken: string | JwtPayload | undefined) {
//   const { productEntry } = req.body;
//   switch (req.method) {
//     case "POST":
//       try {
//         console.log(productEntry);
//         return res.status(200).json({ message: "Report Created" });
//       } catch (error) {
//         return console.log(error);
//       }
//     case "GET":
//       try {
//         return res.send("Report Created");
//       } catch (error) {
//         return console.log(error);
//       }
//     default:
//       break;
//   }
// }

// export default authMiddleware(handler);
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
  const { productEntry } = req.body;

  switch (req.method) {
    case "POST":
      try {
        /**
         * ExpiryDate
         * SKU
         * Price
         */

        let userId: string | undefined;
        if (verifiedToken && typeof verifiedToken === "object") {
          userId = verifiedToken.id; // Assign the userId from the token
        }
        console.log({ productEntry, id: userId });
        return res.status(200).json({ productEntry, id: userId });
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

export default authMiddleware(handler);
