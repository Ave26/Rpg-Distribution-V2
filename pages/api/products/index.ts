import { findProduct } from "@/lib/prisma/product";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Allow", ["POST", "GET"]);
  switch (req.method) {
    case "GET":
      try {
        const { products, error } = await findProduct();
        if (products) {
          return res.status(200).json(products);
        }
        if (error) {
          return res.send("database" + error);
        }
      } catch (error) {
        return res.send(error);
      }
    case "POST":

    default:
      res.json({
        message: `${req.method} method is not allowed`,
      });
  }
};

export default handler;
