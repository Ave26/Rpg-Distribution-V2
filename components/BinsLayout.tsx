import React from "react";
import { Product, Categories } from "@/types/types";
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
  products: Product;
}

interface BinsProps {
  bins: Bin[];
}

function BinsLayout({ bins }: BinsProps) {
  return (
    <div className="bg-transparentshadow-slate-900 flex h-fit w-full flex-col gap-4 p-2">
      {bins.map((bin: Bin) => {
        return (
          <h1 key={bin?.id} className="bg-white p-4 shadow-sm">
            <div>Quantity: {Number(bin?._count.assignment)}</div>
            <div>Quantity: {String(bin?.racks?.categories.category)}</div>
            {/* <div>
              Quantity:{" "}
              {String(
                bin?.assignment?.map((value) => {
                  return <div>{value.products?.}</div>;
                })
              )}
            </div> */}
          </h1>
        );
      })}
    </div>
  );
}

export default BinsLayout;
