import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { verifyJwt } from "@/lib/helper/jwt";
import { scanBarcode } from "@/lib/prisma/product";

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
  const { message, barcodeId, category } = req.body;

  switch (req.method) {
    case "POST":
      try {
        const { barcodeIdInBin, error } = await scanBarcode(
          barcodeId,
          category
        );

        if (error) {
          return res.json({
            message: error,
          });
        }

        if (!barcodeIdInBin) {
          return res.json({
            message: "Product Not Found",
          });
        }

        return res.json({ message, barcodeIdInBin, category });
      } catch (error) {
        return res.json(error);
      }

    case "PATCH":
      break;

    default:
      break;
  }
};

export default middleware(handler);
