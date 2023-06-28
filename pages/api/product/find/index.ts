import { verifyJwt } from "@/lib/helper/jwt";
import {
  findProductDetails,
  findManyProduct,
  findProduct,
} from "@/lib/prisma/product";
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
  switch (req.method) {
    case "POST":
      const { barcodeId } = req.body;

      try {
        const { product, error } = await findProduct(barcodeId);
        if (error) {
          return res.json({ error });
        }

        return product
          ? res.status(200).json({ message: "Product Already Created" })
          : res.status(404).json({ message: "Product Not found" });
      } catch (error) {
        return res.json(error);
      }

    case "GET":
      try {
        const { product, error } = await findManyProduct();
        if (error) {
          return res.json(error);
        }

        return res.status(200).json({
          product,
        });
      } catch (error) {
        return res.json(error);
      }

    default:
      return res.send(`Method ${req.method} is not available`);
  }
};
export default middleware(handler);
