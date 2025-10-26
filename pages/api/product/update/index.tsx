import { verifyJwt } from "@/lib/helper/jwt";
import { findManyProduct } from "@/lib/prisma/product";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const middleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("middleware working properly");
    try {
      const token = req.cookies.token;

      const { verifiedToken, error }: any = await verifyJwt(token);

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
  const { image } = req.body;
  switch (req.method) {
    case "PUT":
      console.log(image);

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
