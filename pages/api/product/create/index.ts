import { verifyJwt } from "@/lib/helper/jwt";
import {
  addNewProduct,
  findManyProduct,
  findProductDetails,
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
  const { barcodeId, category, image, price, productName, quantity } = req.body;
  switch (req.method) {
    case "POST":
      try {
        if (!barcodeId || !category || !image || !price || !productName) {
          return res.json({
            message: "Please complete the fields",
          });
        }

        console.log(barcodeId, category, image, price, productName, "server");

        const { newProduct, error, findProduct } = await addNewProduct(
          barcodeId,
          category,
          image,
          Number(price),
          productName
        );

        if (findProduct) {
          return res.json({ message: "Product Already Created" });
        }

        if (error) {
          return res.json({ error });
        }

        return res.status(200).json({ newProduct, message: "Product Added" });
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
