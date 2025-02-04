import {
  records,
  trucks,
  users,
  orderedProducts,
  products,
  ProductStatus,
} from "@prisma/client";

type TAuthor = Omit<users, "id" | "password" | "additionalInfo" | "roles">;

export type TRecords = records & {
  trucks: trucks;
  author: TAuthor;
  orderedProducts: TOrderedProducts[];
};

type TAssginedProducts = {
  id: string;
  expirationDate: Date;
  status: ProductStatus;
};

type TOrderedProducts = orderedProducts & {
  assignedProducts: TAssginedProducts[];
  products: products;
};
