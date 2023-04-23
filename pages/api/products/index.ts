import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { findAllProducts } from "@/lib/prisma/product";
import { verifyJwt } from "@/lib/helper/jwt";

// pages/api/middleware.js

const middleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { verifiedToken, error }: any = await verifyJwt(req);

      if (error) {
        return res.send(error);
      }
      if (verifiedToken) {
        return handler(req, res);
      }
    } catch (error) {
      return res.send(error);
    }
  };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("allow", ["GET"]);
  const { products, error } = await findAllProducts();
  if (req.method === "GET") {
    try {
      if (error) {
        return res.send(error);
      }

      return res.status(200).send(products);
    } catch (error) {
      res.send(error);
    }
  }
  return res
    .status(405)
    .json({ message: `Method '${req.method}' not allowed` });
};

export default middleware(handler);
