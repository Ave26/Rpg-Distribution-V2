import prisma from ".";
const recieveProduct = async (
  barcodeId: string,
  productName: string,
  quantity: number,
  sku: string,
  palletteLocation: string,
  dateReceived: string,
  expirationDate: string,
  poId: string,
  image: string
) => {
  console.log(barcodeId);
  try {
    const newProduct = await prisma.products.create({
      data: {
        barcodeId: barcodeId,
        productName: productName,
        quantity: 50,
        sku: "SKU-002",
        palletteLocation: "A-2",
        dateReceived: "2022-04-21",
        expirationDate: "2023-01-01",
        poId: "PO-002",
        image: "",
      },
    });

    return { newProduct };
  } catch (error) {
    return { error };
  }
};

export default recieveProduct;
