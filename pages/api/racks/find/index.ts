import { verifyJwt } from "@/lib/helper/jwt";
import { findCategory } from "@/lib/prisma/scan";
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
  switch (req.method) {
    case "POST":
      console.log(barcodeId, rackName);
      const { data } = await findCategory(barcodeId, rackName);
      return res.status(200).json(data);

    case "GET":

    default:
      return res.send(`Method ${req.method} is not available`);
  }
};
export default middleware(handler);
