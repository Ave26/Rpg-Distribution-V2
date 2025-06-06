import { formatDate } from "@/utils";
import React from "react";
import { BinResult, binTitles } from "../../types";

interface BinTableProps {
  bins: BinResult[] | undefined;
}

function BinTable({ bins }: BinTableProps) {
  return (
    <div className="flex h-full w-full flex-col items-start justify-start overflow-auto rounded-l-lg scrollbar-track-rounded-lg md:col-span-2 md:row-span-4 md:w-full md:overflow-x-hidden md:overflow-y-scroll">
      <ul className="sticky top-0 flex w-full gap-1  rounded-b-none bg-slate-400 p-1 font-semibold uppercase">
        {binTitles.map((title) => {
          return (
            <li
              key={title}
              className="flex w-full items-center justify-center rounded-lg border text-center"
            >
              {title}
            </li>
          );
        })}
      </ul>
      {Array.isArray(bins) &&
        bins.map((bin, i) => {
          return (
            <ul
              key={i}
              className="flex h-fit w-full items-center justify-center  gap-1 break-all bg-white p-1 uppercase"
            >
              <li className="flex h-full w-full items-center justify-center border">
                {bin.category}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {bin.rackName}
                {bin.row}/{bin.shelfLevel}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {bin.assignedProducts.map((ap) => ap.skuCode)}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {bin.assignedProducts.map((ap) => ap.products.productName)}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {bin.assignedProducts.map((ap) => formatDate(ap.dateInfo.date))}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {bin._count.assignedProducts}
              </li>
            </ul>
          );
        })}
    </div>
  );
}

export default BinTable;
