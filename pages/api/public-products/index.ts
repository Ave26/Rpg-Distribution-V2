import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { findAllProducts } from "@/lib/prisma/product";
import { verifyJwt } from "@/lib/helper/jwt";

// pages/api/middleware.js

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("allow", ["GET"]);
  const { products, error } = await findAllProducts();
  if (req.method === "GET") {
    try {
      if (error) {
        return res.send(error);
      }
      //   const { productName, expirationDate, quantity } = products;

      return res.status(200).send(products);
    } catch (error) {
      res.send(error);
    }
  }
  return res
    .status(405)
    .json({ message: `Method '${req.method}' not allowed` });
};

export default handler;
