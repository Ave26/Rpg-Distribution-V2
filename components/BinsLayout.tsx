import React from "react";
import { Categories } from "@/types/types";
import { categories } from "@prisma/client";
interface Bin {
  id: string;
  isAvailable: boolean;
  capacity: number;
  shelfLevel: number;
  row: number;
  isSeleted: boolean;
  status: null;
  racksId: string;
  _count: {
    assignment: Assignment[];
  };
  racks: {
    categories: categories;
  };
  assignment: Assignment[];
}

interface Assignment {
  id: string;
  dateReceive: Date;
  purchaseOrder: string;
  expirationDate: Date;
  boxSize: string;
  isDamage: null;
  productId: string;
  binId: string;
  usersId: null;
  damageBinId: null;
  products: products;
}

interface products {
  id: string;
  barcodeId: string;
  category: string;
  image: string;
  price: number;
  productName: string;
  sku: string;
}

interface BinsProps {
  bins: Bin[];
}

function BinsLayout({ bins }: BinsProps) {
  return (
    <div className="flex h-fit w-full flex-col gap-4 bg-transparent p-2 shadow-slate-900 ">
      {bins.map((bin: Bin) => {
        return (
          <h1 key={bin?.id} className="bg-white p-4 shadow-sm">
            <div>Quantity: {Number(bin?._count.assignment)}</div>
            <div>
              Product Category: {String(bin?.racks?.categories.category)}
            </div>
            <div>
              {`Product Name: ${
                bin?.assignment?.map((assign) => {
                  return assign?.products?.productName;
                })[0]
              }`}
            </div>
            <div>
              {`Product Name: ${
                bin?.assignment?.map((assign) => {
                  return assign?.products?.sku;
                })[0]
              }`}
            </div>
          </h1>
        );
      })}
    </div>
  );
}
/**
 * Product Name
 * SKU
 * Quanity
 */

export default BinsLayout;
