import {
  assignedProducts,
  bins,
  categories,
  products,
  racks,
  stockKeepingUnit,
} from "@prisma/client";

export type TProducts = products & {
  _count: {
    assignedProducts: number;
  };
  sku: stockKeepingUnit[];
  assignedProducts: TAssignedProducts[];
};

export type TBins = bins & {
  assignedProducts: TAssignedProducts[];
  racks: TRacks;
  _count: {
    assignedProducts: number;
  };
};

type TAssignedProducts = assignedProducts & {
  products: products;
  sku: stockKeepingUnit;
};

type TRacks = racks & {
  categories: categories;
};

export type TToast = {
  show: boolean;
  message: string;
};

export type TUpdateProductId = {
  id: string;
  barcodeId: string;
  productName: string;
  price: number;
};

export type TSKU = Omit<stockKeepingUnit, "id">;

export type TInput = {
  id: string;
  productName: string;
  price: number;
  skuCode: string;
  threshold: number;
  weight: number;
};
