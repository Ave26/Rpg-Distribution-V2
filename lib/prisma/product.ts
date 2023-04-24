import prisma from ".";

export const recieveProduct = async (
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
        quantity: quantity,
        sku: sku,
        palletteLocation: palletteLocation,
        dateReceived: dateReceived,
        expirationDate: expirationDate,
        poId: poId,
        image: "",
      },
    });

    return { newProduct };
  } catch (error) {
    return { error };
  }
};

export const findAllProducts = async () => {
  try {
    const products = await prisma.products.findMany();
    return { products };
  } catch (error) {
    return { error };
  }
};

export const findProducts = async () => {
  try {
    const products = await prisma.products.findMany({
      select: {
        productName: true,
        expirationDate: true,
        quantity: true,
      },
    });
    return { products };
  } catch (error) {
    return { error };
  }
};
