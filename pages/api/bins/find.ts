import { NextApiRequest, NextApiResponse } from "next";
import {
  findBinByBarcode,
  updateSelectedBin,
  findAllBin,
} from "@/lib/prisma/bin";
import { authMiddleware } from "../authMiddleware";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { barcodeId } = req.body;
  if (!barcodeId) {
    // console.log("find All Bin triggered");
    const { binThatHasCount: bins, error } = await findAllBin();

    if (!bins || error) {
      return res.status(500).json({
        message: "Oops! something went wrong" + error,
      });
    }

    return res.status(200).json(bins);
  } else {
    const { binThatHasCount: bins, error } = await findBinByBarcode(barcodeId);

    if (!bins || error) {
      return res.status(500).json({
        message: "Oops! something went wrong" + error,
      });
    }
    return res.status(200).json(bins);
  }
}

export default authMiddleware(handler);
