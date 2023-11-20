import { bins } from "@prisma/client";

type TSKU = {
  code: string;
};

type TAssignedProducts = {
  skuCode: string;
  sku: {
    weight: number;
  };
  expirationDate: string;
  dateReceive: string;
  products: {
    barcodeId: string;
    category: string;
    productName: string;
    sku: TSKU[];
    price: number;
  };
};

export type TBins = bins & {
  assignedProducts: TAssignedProducts[];
  racks: {
    name: string;
    categories: {
      category: string;
    };
  };
  _count: {
    assignedProducts: number;
  };
};
