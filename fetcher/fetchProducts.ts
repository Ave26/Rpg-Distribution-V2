// useProducts.js
import {
  bins,
  assignedProducts,
  products,
  stockKeepingUnit,
} from "@prisma/client";
import { TBins } from "./fetchBins";

// export type TBins = bins & {
//   _count: { assignedProducts: number };
//   assignedProducts: TAssignedProducts[];
// };

export type TAssignedProducts = assignedProducts & {
  products: products;
  sku: stockKeepingUnit;
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
