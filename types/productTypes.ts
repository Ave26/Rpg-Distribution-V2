import { products, stockKeepingUnit } from "@prisma/client";

type TOmitProducts = Omit<
  products,
  "id" | "supplyLevelStatus" | "discontinued"
>;
type TOmitSKU = Omit<stockKeepingUnit, "id" | "productsId" | "barcodeId">;

export type TProducts = TOmitProducts & {
  sku: TOmitSKU;
};
