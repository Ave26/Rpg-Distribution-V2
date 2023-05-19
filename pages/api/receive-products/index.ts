import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
  recieveProduct,
  findProductDetails,
  createProductDetails,
  createProductLists,
  findProductsBarcodeId,
} from "@/lib/prisma/product";
import { verifyJwt } from "@/lib/helper/jwt";

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

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const {
//     barcodeId,
//     productName,
//     quantity,
//     sku,
//     palletteLocation,
//     dateReceived,
//     expirationDate,
//     poId,
//     image,
//   } = req.body;

//   if (
//     !barcodeId ||
//     !productName ||
//     !quantity ||
//     !sku ||
//     !palletteLocation ||
//     !dateReceived ||
//     !expirationDate ||
//     !poId
//   ) {
//     return res.status(401).json({
//       message: "Missing Details",
//     });
//   }

//   try {
//     const { newProduct, error } = await recieveProduct(
//       barcodeId,
//       productName,
//       quantity,
//       sku,
//       palletteLocation,
//       dateReceived,
//       expirationDate,
//       poId,
//       image
//     );

//     return res.status(200).json({
//       message: "Product Added",
//       newProduct,
//     });
//   } catch (error) {
//     return res.send(error);
//   }
// };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("handler is working");

  switch (req.method) {
    case "GET":
      try {
        // check the available products
        return res.send("receive product working properly");
      } catch (error) {
        return res.status(500).json(error);
      }
    case "POST":
      const { barcodeId } = req.body;
      const { error, product } = await findProductDetails(barcodeId);

      if (error) {
        // if not found then create a new product details with the new barcodId entry
        const { productDetails, error } = await createProductDetails(barcodeId);
        if (error) {
          return res.json(error);
        }
        return res.status(201).json(productDetails);
      }

      if (product) {
        const { createdProductList, error } = await createProductLists(
          product.id
        );

        if (error) {
          return res.json(error);
        }
        if (createdProductList) {
          return res.json({
            message: "Product List Created",
            product: product,
          });
        }
      }

    default:
      break;
  }
};

export default middleware(handler);
//  it needs to have a consistent add
