import { verifyJwt } from "@/lib/helper/jwt";
import { findCategory, findRacks } from "@/lib/prisma/racks";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const middleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("middleware working properly");
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

  if (!barcodeId) {
    return res.status(404).json({
      message: "Filled Incomplete",
    });
  }

  switch (req.method) {
    case "POST":
      const { data } = await findCategory(barcodeId, rackName);
      const { shelfLevel } = await findRacks(barcodeId);

      if (!shelfLevel) {
        return res.status(404).json({
          message: "Oops! something went wrong",
        });
      }

      return res.status(200).json(shelfLevel);

    case "GET":

    default:
      return res.send(`Method ${req.method} is not available`);
  }
};
export default middleware(handler);
