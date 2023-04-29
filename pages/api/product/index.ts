import { NextApiRequest, NextApiResponse } from "next";
import { findProductsBarcodeId, recieveProduct } from "@/lib/prisma/product";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    barcodeId,
    productName,
    quantity,
    sku,
    palletteLocation,
    dateReceived,
    expirationDate,
    poId,
    image,
  } = req.body;

  if (
    !barcodeId ||
    !productName ||
    !quantity ||
    !sku ||
    !palletteLocation ||
    !dateReceived ||
    !expirationDate ||
    !poId
  ) {
    return res.status(401).json({
      message: "Please complete credentials",
    });
  }

  // const { bid, error }: any = findProductsBarcodeId(barcodeId);

  // if (error) {
  //   console.log("error api/products" + error);
  //   return res.status(500).send(error);
  // }

  // if (bid) {
  //   return res.status(401).json({
  //     message: "Product Already Existed",
  //     bid: bid,
  //   });
  // }

  try {
    const { newProduct, error } = await recieveProduct(
      barcodeId,
      productName,
      quantity,
      sku,
      palletteLocation,
      dateReceived,
      expirationDate,
      poId,
      image
    );

    return res.status(200).json({
      message: "Product Added",
      newProduct,
    });
  } catch (error) {
    return res.send(error);
  }
};

export default handler;
