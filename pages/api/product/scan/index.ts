import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { verifyJwt } from "@/lib/helper/jwt";
import { scanBarcode } from "@/lib/prisma/scan";

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
  const { barcodeId, purchaseOrder, boxValue, expiration, quantity } = req.body;

  if (!barcodeId || !boxValue) {
    return res.status(405).json({
      message: "Incomplete Field",
    });
  }
  switch (req.method) {
    case "POST":
      try {
        const { assignment, data }: any = await scanBarcode(
          barcodeId,
          boxValue
        );
        console.log({ assignment });
        console.log({ data });
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

// Setup a plan
// rack category, section and bin in order to assign it
