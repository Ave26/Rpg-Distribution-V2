import {
  assignedProducts,
  bins,
  categories,
  products,
  racks,
} from "@prisma/client";

export type TBins = bins & {
  assignedProducts: TAssignedProducts[];
  racks: TRacks;
  _count: {
    assignedProducts: number;
  };
};

type TAssignedProducts = assignedProducts & {
  products: products;
};

type TRacks = racks & {
  categories: categories;
};

export type TToast = {
  show: boolean;
  message: "";
};
