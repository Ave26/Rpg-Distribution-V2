import { verifyJwt } from "@/lib/helper/jwt";
import { findAllBin, findBin } from "@/lib/prisma/racks";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const middleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { verifiedToken, error }: any = await verifyJwt(req);

      if (error) {
        return res.status(403).json({
          authenticated: false,
          message: error,
        });
      }

      if (verifiedToken) {
        return handler(req, res);
      }
    } catch (error) {
      return res.send(error);
    }
  };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { barcodeId, rackName } = req.body;

  switch (req.method) {
    case "POST":
      if (!barcodeId) {
        return res.status(404).json({
          message: "Filled Incomplete",
        });
      }

      const racks = await findBin(barcodeId);

      if (!racks) {
        return res.status(404).json({
          message: "No record",
        });
      }

      return res.status(200).json(racks);
    case "GET":
      console.log("GET TRIGGERED");
      const { bins, error } = await findAllBin();
      if (!bins || error) {
        return res.status(500).json({
          message: "Oops, something went wrong",
        });
      }

      return res.status(200).json(bins);

    default:
      return res.send(`Method ${req.method} is not available`);
  }
};
export default middleware(handler);
