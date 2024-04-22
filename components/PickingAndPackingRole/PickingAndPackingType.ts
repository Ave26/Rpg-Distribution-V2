import {
  binLocations,
  orderedProducts,
  orderedProductsTest,
  records,
  trucks,
} from "@prisma/client";

export type TTrucks = trucks & {
  records: TRecords[];
};

export type TRecords = records & {
  orderedProductsTest: TOrderedProductsTestWBinLocations[];
};

type TOrderedProductsTestWBinLocations = orderedProductsTest & {
  binLocations: binLocations[];
};
