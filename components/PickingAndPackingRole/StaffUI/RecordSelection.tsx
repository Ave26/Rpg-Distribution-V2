import React from "react";
import { TRecords } from "../PickingAndPackingType";
import OrderedProduct from "./OrderedProduct";

type TRecordSelectionProps = {
  record: TRecords;
};

export default function RecordSelection({ record }: TRecordSelectionProps) {
  return (
    <>
      <h1>Batch Number: {record.batchNumber}</h1>
      <h1>Purchase Order: {record.poId}</h1>
      {record.orderedProducts.map((orderedProduct) => (
        <div className="flex h-fit flex-row justify-between gap-2">
          <div
            key={orderedProduct.id}
            className="flex h-[7em] w-full items-start justify-start gap-2 overflow-y-auto border  border-black p-2"
          >
            <OrderedProduct orderedProduct={orderedProduct} record={record} />
          </div>
        </div>
      ))}
    </>
  );
}
