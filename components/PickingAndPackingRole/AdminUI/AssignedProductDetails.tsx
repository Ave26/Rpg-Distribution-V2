import { TAssignedProducts } from "@/fetcher/fetchProducts";
import React from "react";

type TAssignedProductDetails = { assignedProduct: TAssignedProducts };

function AssignedProductDetails({ assignedProduct }: TAssignedProductDetails) {
  return (
    <div className="flex w-full flex-wrap items-center justify-start gap-2 p-2 text-center text-[10px]">
      <h1 className="flex min-w-[15em] text-center">
        CATEGORY: {assignedProduct.products.category}
      </h1>
      <h1>BARCODE: {assignedProduct.barcodeId}</h1>
      <h1>SKU: {assignedProduct.skuCode}</h1>
      <h1>NAME: {assignedProduct.products.productName}</h1>
    </div>
  );
}

export default AssignedProductDetails;
