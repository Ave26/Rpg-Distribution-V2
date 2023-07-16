import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { verifyJwt } from "@/lib/helper/jwt";
import { findCategory, scanBarcode } from "@/lib/prisma/scan";
import prisma from "@/lib/prisma";

const middleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { verifiedToken, error }: any = await verifyJwt(req);

      if (error) {
        return res.status(403).json({
          message: "Need to be authenticated",
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
  const {
    barcodeId,
    purchaseOrder,
    boxValue,
    expiration,
    quantity,
    binId,
    quality,
  } = req.body;

  if (
    !barcodeId
    // ||
    // !purchaseOrder ||
    // !boxValue ||
    // !expiration ||
    // !binId ||
    // !quality
  ) {
    return res.status(405).json({
      message: "Incomplete Field",
    });
  }

  switch (req.method) {
    case "POST":
      try {
        const data = await scanBarcode(
          barcodeId,
          boxValue,
          expiration,
          Number(quantity),
          binId,
          purchaseOrder,
          quality
        );
        return res.status(200).json(data);
      } catch (error) {
        return res.json(error);
      }

    case "GET":
      try {
      } catch (error) {
        return res.json(error);
      }

    default:
      console.log(`Method ${req.method} is not allowed`);

      break;
  }
};

export default middleware(handler);

// Setup a plan
// rack category, section and bin in order to assign it

// bin (available bin, )
