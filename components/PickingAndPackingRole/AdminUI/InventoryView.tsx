import Loading from "@/components/Parts/Loading";
import useBins from "@/hooks/useBins";
import useProducts from "@/hooks/useProducts";
import { assert } from "console";
import React from "react";

export default function InventoryView() {
  const { bins } = useBins();

  return (
    <div className="h-full w-full flex-col gap-2 overflow-y-scroll rounded-md border border-slate-200 px-2 text-center shadow-md transition-all">
      {Array.isArray(bins) &&
        bins.map((bin) => {
          return (
            <div
              key={bin.id}
              className="flex select-none justify-between rounded-md text-xs shadow-md hover:bg-slate-300/30 active:bg-slate-300/50 md:whitespace-nowrap"
            >
              <h1 className="flex items-center justify-center p-2">
                {bin.shelfLevel}/{bin.row}
              </h1>
              {bin.assignedProducts.map((assignedProduct) => (
                <div
                  key={assignedProduct.id}
                  className="flex h-full w-full gap-2 p-2"
                >
                  <h1>Barcode: {assignedProduct.barcodeId}</h1>
                  <h1>SKU: {assignedProduct.skuCode}</h1>
                  <h1>Category: {assignedProduct.products.category}</h1>
                  <h1>Name: {assignedProduct.products.productName}</h1>
                </div>
              ))}
              <h1 className="flex items-center justify-center p-2">
                Count: {bin._count.assignedProducts}
              </h1>
            </div>
          );
        })}
    </div>
  );
}
