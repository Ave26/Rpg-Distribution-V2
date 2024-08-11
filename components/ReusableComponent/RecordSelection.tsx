import React, { lazy, Suspense } from "react";
import {
  TRecords,
  TTrucks,
} from "../PickingAndPackingRole/PickingAndPackingType";
import OrderedProduct from "../PickingAndPackingRole/StaffUI/OrderedProduct";
import { useMyContext } from "@/contexts/AuthenticationContext";
import LoadRecordButton from "../PickingAndPackingRole/StaffUI/LoadRecordButton";
import DeliverButton from "../DeliveryMangement/Driver/DeliverButton";
import { TToast } from "../PickingAndPackingRole/Toast";

type TRecordSelectionProps = {
  data: TData;
};

type TData = {
  record: TRecords;
  truck: TTrucks;
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
};

export default function RecordSelection({ data }: TRecordSelectionProps) {
  const { globalState } = useMyContext();
  const role: string | undefined = globalState?.verifiedToken?.roles;
  const isStaff = role === "Staff";
  const isDriver = role === "Driver";
  const { record, truck, setToast } = data;

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-[.5px] border border-dotted border-red-600 p-[2px]">
        <h1 className="text-lg">Record Details</h1>
        <ul>Batch Number: {record.batchNumber}</ul>
        <ul>Purchase Order: {record.SO}</ul>
        <ul>Destination: {record.locationName}</ul>
        <ul>Client: {record.clientName}</ul>
      </div>
      <div className="h-[11em] overflow-y-scroll border border-black">
        {record.orderedProducts.map((orderedProduct) => (
          <div
            key={orderedProduct.id}
            className="flex h-fit flex-col justify-between gap-1 p-2"
          >
            <h1 className="uppercase">Ordered Products</h1>
            <div>
              <li className="flex w-full flex-col items-start justify-start gap-2 border-y-2 border-dotted border-slate-900 p-1">
                <ul className="">
                  <OrderedProduct
                    orderedProduct={orderedProduct}
                    record={record}
                  />
                </ul>
              </li>

              {isStaff && (
                <div className="sticky flex items-center justify-center py-3">
                  <LoadRecordButton
                    truck={truck}
                    orderedProduct={orderedProduct}
                    record={record}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {isDriver && <DeliverButton states={{ record, truck, setToast }} />}
    </>
  );
}
