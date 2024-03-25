import React, { useEffect } from "react";
import {
  TRecords,
  TTrucks,
} from "../PickingAndPackingRole/PickingAndPackingType";
import OrderedProduct from "../PickingAndPackingRole/StaffUI/OrderedProduct";
import { useMyContext } from "@/contexts/AuthenticationContext";
import LoadRecordButton from "../PickingAndPackingRole/StaffUI/LoadRecordButton";
import DeliverButton from "../DeliveryMangement/Driver/DeliverButton";

type TRecordSelectionProps = {
  data: TData;
};

type TData = {
  record: TRecords;
  truck: TTrucks;
};

export default function RecordSelection({ data }: TRecordSelectionProps) {
  const { globalState } = useMyContext();
  const role: string | undefined = globalState?.verifiedToken?.roles;
  const isStaff = role === "Staff";
  const isDriver = role === "Driver";
  const { record, truck } = data;

  useEffect(() => {
    console.log({ truck: truck });
  }, [truck]);

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-[.5px] border border-dotted border-red-600 p-[2px]">
        <h1 className="text-lg">Record Details</h1>

        <ul>Batch Number: {record.batchNumber}</ul>
        <ul>Purchase Order: {record.poId}</ul>
        <ul>Desitnation: {record.destination}</ul>
        <ul>Route: {"<Point of Location>"}</ul>
        <ul>Client: {record.clientName}</ul>
      </div>
      <div className="h-[11em] overflow-y-scroll border border-black">
        {record.orderedProducts.map((orderedProduct) => (
          <div
            key={orderedProduct.id}
            className="flex h-fit flex-row justify-between gap-1 p-2"
          >
            <li className="flex w-full items-center justify-start gap-2 border-y-2 border-dotted border-slate-900 p-1">
              <ul>
                <OrderedProduct
                  orderedProduct={orderedProduct}
                  record={record}
                />
              </ul>
            </li>

            {isStaff && (
              <div className="flex items-center justify-center py-3">
                <LoadRecordButton
                  truck={truck}
                  orderedProduct={orderedProduct}
                  record={record}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {isDriver && <DeliverButton />}
    </>
  );
}
