import { Category } from "@prisma/client";
import prisma from ".";

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
    const product = await prisma.products.findMany({});
    return { product };
  } catch (error) {
    return { error };
  }
};

// ------------------------------------------------------------- test product adding
// Barcode Scan
// Create a auto assign bin system

export const findProduct = async (barcodeId: string) => {
  try {
    const product = await prisma.products.findUnique({
      where: {
        barcodeId,
      },
    });
    return { product };
  } catch (error) {
    return { error };
  }
};

// export const addNewProduct = async (
//   barcodeId: string,
//   category: Category,
//   image: string,
//   price: number,
//   productName: string,
//   skuCode: string
// ) => {
//   console.log(barcodeId, category, image, price, productName, "prisma");
//   try {
//     const findProduct = await prisma.products.findUnique({
//       where: {
//         barcodeId,
//       },
//     });

//     if (findProduct) {
//       return { findProduct };
//     } else {
//       const newProduct = await prisma.products.create({
//         data: {
//           barcodeId,
//           category,
//           image,
//           price,
//           productName,
//           sku,
//         },
//       });
//       return { newProduct };
//     }
//   } catch (error) {
//     console.log(error);
//     return { error };
//   }
// };
