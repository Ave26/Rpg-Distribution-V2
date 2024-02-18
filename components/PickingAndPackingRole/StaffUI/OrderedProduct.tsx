import { UserRole, orderedProducts } from "@prisma/client";
import React, { useContext } from "react";
import LoadRecordButton from "./LoadRecordButton";
import { TRecords } from "../PickingAndPackingType";
import { useMyContext } from "@/contexts/AuthenticationContext";

type TOrderedProductProps = {
  record: TRecords;
  orderedProduct: orderedProducts;
};

function OrderedProduct({ orderedProduct, record }: TOrderedProductProps) {
  return (
    <>
      Ordered Product Id: {orderedProduct.id}
      <h1>Total Quantity: {orderedProduct.totalQuantity}</h1>
      <h1>Barcode Id: {orderedProduct.barcodeId}</h1>
    </>
  );
}

export default OrderedProduct;
