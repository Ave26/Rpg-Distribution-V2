import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { selectAndUpdateBinByQuantity } from "@/lib/prisma/bin";
import { JwtPayload } from "jsonwebtoken";
import { VerifyToken } from "@/types/authTypes";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { binId, quantity, isSelected } = req.body;
  switch (req.method) {
    case "POST":
      try {
        // const { message } = await updateSelectedBin(binId);
        let userId: string | undefined;

        if (verifiedToken && typeof verifiedToken === "object") {
          userId = verifiedToken.id; // Assign the userId from the token
          // console.log(verifiedToken.roles); // User roles
          // console.log(verifiedToken.iat); // Issued At
          // console.log(verifiedToken.exp); // Expiration
        }

        console.log("userId", userId);
        await selectAndUpdateBinByQuantity({
          binId,
          quantity,
          userId,
        });

        // return res.status(200).json(message);
        // return res.send(userId);
      } catch (error) {
        return res.json(error);
      }

    default:
      res.send(`${req.method} is not allows`);
      break;
  }
}

export default authMiddleware(handler);
