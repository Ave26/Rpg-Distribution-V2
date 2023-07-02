import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { findPublicProducts } from "@/lib/prisma/product";
import { verifyJwt } from "@/lib/helper/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("allow", ["GET"]);

  switch (req.method) {
    case "GET":
      const { products, error } = await findPublicProducts();

      try {
        if (error) {
          return res.send(error);
        }

        return res.status(200).send(products);
      } catch (error) {
        return res.send(error);
      }

    default:
      return res
        .status(405)
        .json({ message: `Method '${req.method}' not allowed` });
  }
};

export default handler;
