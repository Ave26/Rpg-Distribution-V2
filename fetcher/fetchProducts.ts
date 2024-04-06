// useProducts.js
import { bins, assignedProducts, products } from "@prisma/client";

type TBins = bins & {
  _count: { assignedProducts: number };
  assignedProducts: TAssignedProducts[];
};

type TAssignedProducts = assignedProducts & {
  products: products;
};

export async function fetchBins(url: string): Promise<TBins[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
