import {
  assignedProducts,
  binLocations,
  orderedProducts,
  records,
  stockKeepingUnit,
  trucks,
} from "@prisma/client";

export type TTrucks = trucks & {
  records: TRecords[];
};

export type TRecords = records & {
  orderedProducts: TOrderedProductsWBinLocations[];
};

export type TOrderedProductsWBinLocations = orderedProducts & {
  binLocations: TBinLocations[];
};

export type TBinLocations = binLocations & {
  assignedProducts: assignedProducts[];
  stockKeepingUnit: stockKeepingUnit;
};
