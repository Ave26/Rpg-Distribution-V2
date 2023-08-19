import { NextApiRequest, NextApiResponse } from "next";
import { updateSelectedBin } from "@/lib/prisma/bin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { binId } = req.body;
  switch (req.method) {
    case "POST":
      try {
        // update the selected bin
        const { message } = await updateSelectedBin(binId);
        return res.status(200).json(message);
      } catch (error) {
        return res.json(error);
      }

    default:
      res.send(`${req.method} is not allows`);
      break;
  }
}
