import { verifyJwt } from "@/lib/helper/jwt";
import { findManyProduct, findProductDetails } from "@/lib/prisma/product";
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
  const { barcodeId, quantity } = req.body;
  switch (req.method) {
    case "POST":
      try {
        // const { product, error } = await findProductDetails(barcodeId);
        // if (error) {
        //   return res.json({ error });
        // }

        // return product
        //   ? res.status(200).json({ product })
        //   : res.status(404).json({ message: "Product Not found" });

        return res.send("THIS IS THE POST METHOD " + "Quantity: " + quantity);
      } catch (error) {
        return res.json(error);
      }

    case "PATCH":
      try {
        return res.json({ quantity });
      } catch (error) {
        return res.json(error);
      }

    default:
      return res.send(`Method ${req.method} is not available`);
  }
};

export default middleware(handler);
