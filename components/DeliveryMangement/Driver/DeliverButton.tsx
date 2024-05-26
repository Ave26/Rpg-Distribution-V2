import Loading from "@/components/Parts/Loading";
import {
  TRecords,
  TTrucks,
} from "@/components/PickingAndPackingRole/PickingAndPackingType";
import { TToast } from "@/components/PickingAndPackingRole/Toast";
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
    const takeTotalAndBinLocId = record.orderedProductsTest.flatMap(
      (orderedProductTest) =>
        orderedProductTest.binLocations.map((binLocation) => ({
          binLocId: binLocation.id,
          result: binLocation.stockKeepingUnit.weight * binLocation.quantity,
        }))
    );

    const accumulateIntoOne = takeTotalAndBinLocId.reduce(
      (accumulator: TData, initial) => {
        accumulator.total += initial.result;
        accumulator.binLocationIds.push(initial.binLocId);
        return accumulator;
      },
      { total: 0, binLocationIds: [] }
    );

    const sendData: TRequest = {
      truckId: truck.id,
      data: accumulateIntoOne,
    };

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

  useEffect(() => {
    // selected record has consist  of ordered products
    // I need to extract all the orderedProducts Test assignedProduct to be udpate with there record
    // or I will just need to pull out the binLocation id in the ordered products id
    // Make a flat map for that
    // console.log(record);
  }, [record]);

  return (
    <button className={buttonStyle} onClick={changeProductStatus}>
      {loading ? <Loading /> : "Hand The Package"}
    </button>
  );
}
