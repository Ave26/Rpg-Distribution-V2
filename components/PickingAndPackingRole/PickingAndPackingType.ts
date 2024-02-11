import { orderedProducts, records, trucks } from "@prisma/client";

export type TTrucks = trucks & {
  records: TRecords[];
};

export type TRecords = records & {
  orderedProducts: orderedProducts[];
};
