// useTrucks.js
import {
  assignedProducts,
  binLocations,
  orderedProductsTest,
  products,
  records,
  stockKeepingUnit,
  trucks,
} from "@prisma/client";

export type TRecords = records & {
  _count: { orderedProductsTest: true };
  orderedProductsTest: TOrderedProductsTest[];
  // trucks: trucks;
};
type TOrderedProductsTest = orderedProductsTest & {
  binLocations: TBinLocations[];
};

type TBinLocations = binLocations & {
  assignedProducts: assignedProducts;
  stockKeepingUnit: TStockKeepingUnit;
};

type TStockKeepingUnit = stockKeepingUnit & {
  products: products;
};

export async function fetchRecords(url: string): Promise<TRecords[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
