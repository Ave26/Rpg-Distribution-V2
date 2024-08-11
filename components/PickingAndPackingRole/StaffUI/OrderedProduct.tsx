import {
  UserRole,
  binLocations,
  orderedProducts,
  stockKeepingUnit,
} from "@prisma/client";
import React, { useContext, useEffect, useState } from "react";
import LoadRecordButton from "./LoadRecordButton";
import {
  TOrderedProductsWBinLocations,
  TRecords,
} from "../PickingAndPackingType";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { TOrderedProductTest } from "../AdminUI/Admin";

type TOrderedProductProps = {
  record: TRecords;
  orderedProduct: TOrderedProductsWBinLocations;
};

// type TOrderedProductsTestWBinLocations = orderedProductsTest & {
//   binLocations: TBinLocations[];
// };

// type TBinLocations = binLocations & {
//   SKU: stockKeepingUnit;
// };

export default function OrderedProduct({
  orderedProduct,
  record,
}: TOrderedProductProps) {
  const [totalQuantity, setTotalQuantity] = useState(0);

  // useEffect(() => {
  //   const total = orderedProduct.binLocations.reduce((acc, initial) => {
  //     return acc + initial.quantity;
  //   }, 0);

  //   setTotalQuantity(total);
  // }, []);

  return (
    <>
      {/* Ordered Product Id: {orderedProduct.id} */}
      <h1>Product Name: {orderedProduct.productName}</h1>
      <div className="flex flex-col gap-[1px]">
        {orderedProduct.binLocations?.map((binLocation) => {
          return (
            <div
              key={binLocation.id}
              className="flex flex-wrap gap-2 border border-black p-2"
            >
              <h1>Quantity: {binLocation.quantity}</h1>
              <h1>SKU Code: {binLocation.skuCode}</h1>
              <h1>Weight: {binLocation.stockKeepingUnit.weight}</h1>
            </div>
          );
        })}
      </div>
    </>
  );
}
