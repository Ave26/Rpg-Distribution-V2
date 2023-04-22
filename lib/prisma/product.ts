import prisma from "./index";

export const findProduct = async () => {
  try {
    const products = await prisma.products.findMany();
    return { products };
  } catch (error) {
    return { error };
  }
};
