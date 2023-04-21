import prisma from "./index";

export const findProduct = async () => {
  try {
    const products = await prisma.products.findMany();
    console.log(products);
    return { products };
  } catch (error) {
    return { error };
  }
};
