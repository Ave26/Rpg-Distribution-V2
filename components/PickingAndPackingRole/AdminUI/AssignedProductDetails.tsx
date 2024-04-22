import { TAssignedProducts } from "@/fetcher/fetchBins";
import React from "react";

type TAssignedProductDetails = { assignedProduct: TAssignedProducts };

function AssignedProductDetails({ assignedProduct }: TAssignedProductDetails) {
  return (
    <div className="flex w-full items-center justify-start gap-2 text-center">
      <h1>BARCODE: {assignedProduct.barcodeId}</h1>
      <h1>SKU: {assignedProduct.skuCode}</h1>
      <h1>CATEGORY: {assignedProduct.products.category}</h1>
      <h1>NAME: {assignedProduct.products.productName}</h1>
    </div>
  );
}

export default AssignedProductDetails;
