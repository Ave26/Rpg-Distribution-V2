import { NextApiRequest } from "next";
import prisma from ".";
import { verifyJwt } from "../helper/jwt";

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

// ---------------------------------------------------------------> NEW LINE FOR FETCHING PRODUCT
import { Product, ProductList, Count } from "@/types/types";

export const createProdudctDetails = async (
  req: NextApiRequest,
  barcodeId: string
) => {
  const { verifiedToken, error }: any = await verifyJwt(req);
  try {
    const newProduct = await prisma.productDetails.create({
      data: {
        barcodeId,
      },
    });

    return { verifiedToken, error };
  } catch (error) {
    return { error };
  }
};

export const findManyProduct = async () => {
  try {
    const product = await prisma.productDetails.findMany({
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

export const findProductDetails = async (barcodeId: string) => {
  const product = await prisma.productDetails.findUnique({
    where: {
      barcodeId,
    },
    include: {
      productLists: {
        where: {
          status: "good",
        },
      },
    },
  });

  try {
    return { product };
  } catch (error) {
    return { error };
  }
};

// ------------------------------------------------------------- test product adding

// interface ProductDetails {
//   barcodeId: string;
//   category: string;
//   image: string;
//   price: number;
//   productName: string;
// }

export const findProduct = async (barcodeId: string) => {
  try {
    const product = await prisma.sampleProductDetails.findUnique({
      where: {
        barcodeId,
      },
    });
    return { product };
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
    const findProduct = await prisma.sampleProductDetails.findUnique({
      where: {
        barcodeId,
      },
    });

    if (findProduct) {
      return { findProduct };
    } else {
      const newProduct = await prisma.sampleProductDetails.create({
        data: {
          barcodeId: barcodeId,
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
