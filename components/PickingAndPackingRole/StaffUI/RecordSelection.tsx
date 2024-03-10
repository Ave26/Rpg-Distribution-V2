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
  const isDriver = role === "Driver";
  // const mapComponent = {
  //   SuperAdmin: () => null,
  //   Admin: () => null,
  //   Driver: () => null,
  //   Staff: (orderedProduct: orderedProducts) => (
  //     <div className="flex h-full gap-2 border py-2 transition-all">
  //       <LoadRecordButton orderedProduct={orderedProduct} record={record} />
  //     </div>
  //   ),
  // };

  // const renderButton = mapComponent[role as UserRole];
  const buttonStyle =
    "rounded-sm bg-sky-300/40 w-full flex justify-center items-center text-center h-10 p-2 shadow-md text-[8px] hover:bg-sky-300/10 active:bg-sky-300 uppercase  font-black";

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

            {!isDriver && (
              <div className="flex h-full gap-2 border py-2 transition-all">
                <LoadRecordButton
                  orderedProduct={orderedProduct}
                  record={record}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {role === "Driver" && (
        <button className={buttonStyle}>Complete Delivery</button>
      )}
    </>
  );
}
