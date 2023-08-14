import React, { useEffect, useState } from "react";
import { Categories } from "@/types/types";

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
  racks: Racks;
  assignment: Assignment[];
}

interface Racks {
  id: string;
  name: string;
  isAvailable: boolean;
  categoriesId: string;
  categories: Categories;
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

  barcode: string;
}

function BinsLayout({ bins, barcode }: BinsProps) {
  return (
    <div className="flex h-fit w-full flex-col gap-4 bg-transparent p-2 shadow-slate-900 ">
      {bins?.map((bin: Bin) => {
        return (
          <button
            key={bin?.id}
            className="cursor-pointer bg-white p-4 text-start font-bold shadow-sm">
            <h1>Quantity: {Number(bin?._count.assignment)}</h1>
            <h1>Product Category: {String(bin?.racks?.categories.category)}</h1>
            <h1>
              {`Product Name: ${
                bin?.assignment?.map((assign) => {
                  return assign?.products?.productName;
                })[0]
              }`}
            </h1>
            <h1>
              {`Product SKU: ${
                bin?.assignment?.map((assign) => {
                  return assign?.products?.sku;
                })[0]
              }`}
            </h1>
            <h1>
              {`Price: ${
                bin?.assignment?.map((assign) => {
                  return Number(assign?.products?.price);
                })[0]
              }`}
            </h1>
            <h1>
              Bin: {bin?.racks?.name}
              {bin?.row} - {bin?.shelfLevel}
            </h1>
          </button>
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
