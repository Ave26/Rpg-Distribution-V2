import React, { useEffect, useState } from "react";
import { Bin } from "@/types/inventory";
import Loading from "./Parts/Loading";

interface BinsProps {
  bins?: Bin[] | undefined;
  isLoading: boolean;
}

function BinsLayout({ bins, isLoading }: BinsProps) {
  const titles = [
    "Quantity",
    "Product Category",
    "Product Name",
    "Product SKU",
    "Price",
    "Bin",
    "Selected",
  ];
  async function selectBin(binId: string) {
    // ability to select the bin and update it into selected and send also the quantity
    try {
      const response = await fetch("/api/bin/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          binId,
        }),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative h-80 w-full overflow-y-auto border bg-gray-100 text-gray-700 transition-all dark:bg-gray-700 dark:text-gray-400">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className=" bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {titles.map((title, index) => {
              return (
                <th
                  scope="col"
                  key={index}
                  className={`px-6 py-3 ${
                    (index === 0 && "rounded-l-lg") ||
                    (index === 6 && "rounded-r-lg")
                  }`}>
                  {title}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {bins?.map((bin, index) => {
            return (
              <tr
                key={index}
                className="border-green h-10 cursor-pointer bg-white dark:bg-gray-800">
                <td className="px-6 py-4">{Number(bin?._count?.assignment)}</td>
                <td className="px-6 py-4">
                  {String(bin?.racks?.categories?.category)}
                </td>
                <td className="px-6 py-4">
                  {
                    bin?.assignment?.map((assign) => {
                      return assign?.products?.productName;
                    })[0]
                  }
                </td>
                <td className="px-6 py-4">
                  {
                    bin?.assignment?.map((assign) => {
                      return assign?.products?.price;
                    })[0]
                  }
                </td>
                <td className="px-6 py-4">
                  {bin?.assignment?.map((assign) => assign?.products?.price)[0]}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {bin?.racks?.name} {bin?.row} - {bin?.shelfLevel}
                </td>
                <td className="px-6 py-4">{Boolean(bin?.isSeleted)}</td>
              </tr>
            );
          })}
        </tbody>

        {/* <tfoot>
          <tr className="font-semibold text-gray-900 dark:text-white">
            <th scope="row" className="px-6 py-3 text-base">
              Total
            </th>
            <td className="px-6 py-3">3</td>
            <td className="px-6 py-3">21,000</td>
          </tr>
        </tfoot> */}
      </table>
    </div>
  );
}
/**
 * Product Name
 * SKU
 * Quanity
 */

export default BinsLayout;
