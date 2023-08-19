import React, { useEffect, useState } from "react";
import { Bin } from "@/types/inventory";

interface BinsProps {
  bins?: Bin[] | undefined;
  buttonProps: ButtonEventProps;
}

interface ButtonEventProps {
  binId: string;
  setBinId: React.Dispatch<React.SetStateAction<string>>;
}

function BinsLayout({ bins, buttonProps }: BinsProps) {
  return (
    <div className="flex h-fit w-full flex-col gap-4 bg-transparent p-2 shadow-slate-900 ">
      {bins?.map((bin: Bin) => {
        return (
          <button
            onClick={() => {
              console.log(bin?.id);
              buttonProps?.setBinId(bin?.id);
            }}
            key={bin?.id}
            className="cursor-pointer bg-white p-4 text-start font-bold shadow-sm">
            <h1>Quantity: {Number(bin?._count?.assignment)}</h1>
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
