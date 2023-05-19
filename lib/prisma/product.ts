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

// ________________________________________________

// find, update or create
// product details -> find ? create : update

export const findProductDetails = async (barcodeId: string) => {
  try {
    const product = await prisma.productDetails.findFirstOrThrow({
      where: {
        barcodeId,
      },

      include: {
        productLists: true,
      },
    });
    console.log(product);
    return { product };
  } catch (error) {
    return { error };
  }
};

export const createProductDetails = async (barcodeId: string) => {
  try {
    const productDetails = await prisma.productDetails.create({
      data: {
        barcodeId,
        img: "",
        price: 0.0,
        productName: "",
        quantity: 0,
        sku: "",
      },
    });
    return { productDetails };
  } catch (error) {
    return { error };
  }
};

export const createProductLists = async (id: string) => {
  try {
    const createdProductList = await prisma.productLists.create({
      data: {
        palleteLocation: "test",
        status: "test",
        poId: "test",
        expirationDate: "test",
        productDetails: {
          connect: {
            id,
          },
        },
      },
    });

    const quantity = await prisma.productLists.findMany({});
    console.log(quantity);
    return { createdProductList, quantity };
  } catch (error) {
    return { error };
  }
};
