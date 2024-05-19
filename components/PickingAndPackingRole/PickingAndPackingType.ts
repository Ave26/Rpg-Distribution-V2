import {
  assignedProducts,
  binLocations,
  orderedProducts,
  orderedProductsTest,
  records,
  stockKeepingUnit,
  trucks,
} from "@prisma/client";

export type TTrucks = trucks & {
  records: TRecords[];
};

export type TRecords = records & {
  orderedProductsTest: TOrderedProductsTestWBinLocations[];
};

export type TOrderedProductsTestWBinLocations = orderedProductsTest & {
  binLocations: TBinLocations[];
};

export type TBinLocations = binLocations & {
  assignedProducts: assignedProducts[];
  stockKeepingUnit: stockKeepingUnit;
};
