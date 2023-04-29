import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { findAllProducts, findProductBaseOnName } from "@/lib/prisma/product";
import { verifyJwt } from "@/lib/helper/jwt";

// pages/api/middleware.js

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("allow", ["GET"]);

  switch (req.method) {
    case "GET":
      const { products, error } = await findAllProducts();

      try {
        if (error) {
          return res.send(error);
        }

        return res.status(200).send(products);
      } catch (error) {
        return res.send(error);
      }

    // case "POST":
    //   const { productName } = req.body;
    //   const product = findProductBaseOnName(productName);
    //   if (!product) {
    //     return res.send("no product");
    //   }
    //   try {
    //     // return res.send("post is working " + productName);
    //     return product;
    //   } catch (error) {
    //     return res.status(500).json({
    //       message: "GET Error " + error,
    //     });
    //   }

    default:
      return res
        .status(405)
        .json({ message: `Method '${req.method}' not allowed` });
  }
};

export default handler;
