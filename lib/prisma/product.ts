import { NextApiRequest } from "next";
import prisma from ".";
import { verifyJwt } from "../helper/jwt";

export const findPublicProducts = async () => {
  try {
    const products = await prisma.products.findMany({});
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

// ---------------------------------------------------------------> NEW LINE FOR FETCHING PRODUCT

export const findManyProduct = async () => {
  try {
    const product = await prisma.products.findMany({
      include: {
        _count: {
          select: {
            productLists: true,
          },
        },
        productLists: true,
      },
    });
    return { product };
  } catch (error) {
    return { error };
  }
};

// export const findProductDetails = async (barcodeId: string) => {
//   const product = await prisma.productDetails.findUnique({
//     where: {
//       barcodeId,
//     },
//     include: {
//       productLists: {
//         where: {
//           status: "good",
//         },
//       },
//     },
//   });

//   try {
//     return { product };
//   } catch (error) {
//     return { error };
//   }
// };

// ------------------------------------------------------------- test product adding
// Barcode Scan
// Create a auto assign bin system

interface ProductDetails {
  barcodeId: string;
  category: string;
  image: string;
  price: number;
  productName: string;
}

const setBinQuantity = async (binMaxQuantity: number) => {
  try {
    const maxQuantity = await prisma.bin.create({
      data: {
        maxQuantiy: binMaxQuantity,
      },
    });
    if (maxQuantity) {
      console.log("do something");
    }

    return {
      message: `Max quantity set to ${maxQuantity}`,
    };
  } catch (error) {
    return { error };
  }
};

const findMaxQuantityPerBin = async (maxSize: string) => {
  try {
    switch (maxSize) {
      case "Small":
        console.log("set bin quantity to 12");
        let maxQuantity = 12;
        setBinQuantity(12);
        break;

      case "Medium":
        console.log("set bin quantity to 10");
        setBinQuantity(10);
        break;
      case "Large":
        console.log("set bin quantity to 6");
        setBinQuantity(6);
        break;

      default:
        console.log("Default");
        break;
    }
  } catch (error) {
    return { error };
  }
};

export const scanBarcode = async (barcodeId: string, category: string) => {
  try {
    console.log("return something");
  } catch (error) {
    return { error };
  }
};

export const addNewProduct = async (
  barcodeId: string,
  category: string,
  image: string,
  price: number,
  productName: string
) => {
  console.log(barcodeId, category, image, price, productName, "prisma");
  try {
    const findProduct = await prisma.products.findUnique({
      where: {
        barcodeId,
      },
    });
    // await findMaxQuantityPerBin(barcodeId)

    if (findProduct) {
      return { findProduct };
    } else {
      const newProduct = await prisma.products.create({
        data: {
          barcodeId,
          category,
          image,
          price,
          productName,
        },
      });
      return { newProduct };
    }
  } catch (error) {
    console.log(error);
    return { error };
  }
};
