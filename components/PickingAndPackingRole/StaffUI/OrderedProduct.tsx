import {
  UserRole,
  binLocations,
  orderedProducts,
  orderedProductsTest,
} from "@prisma/client";
import React, { useContext, useEffect, useState } from "react";
import LoadRecordButton from "./LoadRecordButton";
import { TRecords } from "../PickingAndPackingType";
import { useMyContext } from "@/contexts/AuthenticationContext";

type TOrderedProductProps = {
  record: TRecords;
  orderedProduct: TOrderedProductsTestWBinLocations;
};

type TOrderedProductsTestWBinLocations = orderedProductsTest & {
  binLocations: binLocations[];
};

export default function OrderedProduct({
  orderedProduct,
  record,
}: TOrderedProductProps) {
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const total = orderedProduct.binLocations.reduce((acc, initial) => {
      return acc + initial.quantity;
    }, 0);

    setTotalQuantity(total);
  }, []);

  return (
    <>
      Ordered Product Id: {orderedProduct.id}
      <h1>Total Quantity: {totalQuantity}</h1>
      <h1>Product Name: {orderedProduct.productName}</h1>
    </>
  );
}
