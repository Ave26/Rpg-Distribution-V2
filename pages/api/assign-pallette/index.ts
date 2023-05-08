import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const middleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { verifiedToken, error } = await verifyJwt(req);

    try {
      if (error) {
        return res.json(error);
      }
      if (verifiedToken) {
        return handler(req, res);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  };

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Allow", ["POST", "GET", "PUT"]);
  const { barcodeId } = req.body;
  res.json({
    message: "skwak",
  });
  switch (req.method) {
    case "POST":
      // const {} = findProductsBarcodeId();

      break;

    default:
      return res.json({
        message: `${req.method} method is not allowed`,
      });
  }
};

export default middleware(handler);
