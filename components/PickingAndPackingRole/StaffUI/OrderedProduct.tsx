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
  const { globalState } = useMyContext();
  const role: string | undefined = globalState?.verifiedToken?.roles;
  const mapComponent = {
    SuperAdmin: null,
    Admin: null,
    Driver: null,
    Staff: (
      <LoadRecordButton
        key={orderedProduct.id}
        orderedProduct={orderedProduct}
        record={record}
      />
    ),
  };

  const renderComponent = mapComponent[role as UserRole];

  return (
    <>
      OrderedProductId: {orderedProduct.id}
      <h1>Total Quantity: {orderedProduct.totalQuantity}</h1>
      <h1>Barcode Id: {orderedProduct.barcodeId}</h1>
      <div className="flex h-[3em] gap-2 transition-all">{renderComponent}</div>
    </>
  );
}

export default OrderedProduct;
