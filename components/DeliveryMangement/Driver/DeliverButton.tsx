import Loading from "@/components/Parts/Loading";
import {
  TRecords,
  TTrucks,
} from "@/components/PickingAndPackingRole/PickingAndPackingType";
import { TToast } from "@/components/PickingAndPackingRole/Toast";
import { UpdateProduct } from "@/pages/api/outbound/product/update-status";
import { buttonStyle, buttonStyleSubmit } from "@/styles/style";
import React, { useEffect, useState } from "react";
import { mutate } from "swr";

type TDeliveryButton = {
  states: TStates;
};

type TStates = {
  truck: TTrucks;
  record: TRecords;
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
};

type TData = {
  binLocationIds: string[];
  total: number;
};

export type TRequest = {
  truckId: string;
  data: TData;
};

export default function DeliverButton({ states }: TDeliveryButton) {
  const { record, truck } = states;
  const [loading, setLoading] = useState(false);

  function changeProductStatus() {
    setLoading(true);
    const takeTotalAndBinLocId = record.orderedProducts.flatMap(
      (orderedProduct) =>
        orderedProduct.binLocations.map((binLocation) => ({
          binLocId: binLocation.id,
          result: binLocation.stockKeepingUnit.weight * binLocation.quantity,
        }))
    );

    console.log(takeTotalAndBinLocId);
    const accumulateIntoOne = takeTotalAndBinLocId.reduce(
      (accumulator: TData, initial) => {
        accumulator.total += initial.result;
        accumulator.binLocationIds.push(initial.binLocId);
        return accumulator;
      },
      { total: 0, binLocationIds: [] }
    );

    const sendData: UpdateProduct = {
      truckId: truck.id,
      productData: accumulateIntoOne,
    };

    console.log(accumulateIntoOne);

    console.log("changing product status");
    fetch("/api/outbound/product/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendData),
    })
      .then((res) => res.json())
      .then((data) => {
        data && mutate("/api/trucks/find-trucks");
        console.log(data.message);
      })
      .finally(() => setLoading(false));
  }

  return (
    <button className={buttonStyle} onClick={changeProductStatus}>
      {loading ? <Loading /> : "Hand The Package"}
    </button>
  );
}

/* 
  
*/
