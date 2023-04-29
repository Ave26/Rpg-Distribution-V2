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

export const findProductsBarcodeId = async (barcodeId: string) => {
  try {
    const bid = await prisma.products.findUnique({
      where: {
        barcodeId: barcodeId,
      },
    });

    return { bid };
  } catch (error) {
    return { error };
  }
};

export const findProductBaseOnName = async (productName: string) => {
  try {
    const product = await prisma.products.findFirstOrThrow({
      where: {
        productName: "",
      },
      select: {
        id: true,
        barcodeId: true,
        productName: true,
        image: true,
      },
    });
    console.log("this is from prisma product " + product);
    return { product };
  } catch (error) {
    return { error };
  }
};
