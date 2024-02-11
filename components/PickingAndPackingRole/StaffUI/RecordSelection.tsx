import React from "react";
import { TRecords } from "../PickingAndPackingType";
import OrderedProduct from "./OrderedProduct";
import { useMyContext } from "@/contexts/AuthenticationContext";
import LoadRecordButton from "./LoadRecordButton";
import { UserRole, orderedProducts, records } from "@prisma/client";

type TRecordSelectionProps = {
  record: TRecords;
};

export default function RecordSelection({ record }: TRecordSelectionProps) {
  const { globalState } = useMyContext();
  const role: string | undefined = globalState?.verifiedToken?.roles;
  const mapComponent = {
    SuperAdmin: () => null,
    Admin: () => null,
    Driver: () => null,
    Staff: (orderedProduct: orderedProducts) => (
      <LoadRecordButton orderedProduct={orderedProduct} record={record} />
    ),
  };
  const renderComponent = mapComponent[role as UserRole];

  return (
    <>
      <h1>Batch Number: {record.batchNumber}</h1>
      <h1>Purchase Order: {record.poId}</h1>
      {record.orderedProducts.map((orderedProduct) => (
        <div
          key={orderedProduct.id}
          className="flex h-fit flex-row justify-between gap-2"
        >
          <div className="flex h-[5em] w-full items-start justify-start gap-2 overflow-y-auto border  border-black p-2">
            <OrderedProduct orderedProduct={orderedProduct} record={record} />
          </div>
          <div className="flex h-full gap-2 py-2 transition-all">
            {renderComponent(orderedProduct)}
          </div>
        </div>
      ))}
    </>
  );
}
