import { Prisma } from "@prisma/client";

export type TSlug = "bin" | "product" | "damage-bin";

export function isValidSlug(value: string): value is TSlug {
  return ["bin", "product", "damage-bin"].includes(value as TSlug);
}

export type TBinPage = {
  category: "default" | string;
  rackName: "default" | string;
};

export const binTitles = [
  "Category",
  "Bin Location",
  "SKU Code",
  "Item Name",
  "Date",
  "Quantity",
  "Action",
  // "Move Damaged",
  // "Duplicate Product",
] as const;

export type BinResult = Prisma.binsGetPayload<{
  select: {
    id: true;
    category: true;
    row: true;
    shelfLevel: true;
    rackName: true;
    _count: { select: { assignedProducts: true } };
    assignedProducts: {
      select: {
        skuCode: true;
        dateInfo: true;
        products: { select: { productName: true } };
      };
    };
  };
}>;
