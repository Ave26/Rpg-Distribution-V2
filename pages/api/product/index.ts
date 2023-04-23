import { NextApiRequest, NextApiResponse } from "next";
import recieveProduct from "@/lib/prisma/product";
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
    return res.status(200).json(newProduct);
  } catch (error) {
    return res.send(error);
  }
};

export default handler;
