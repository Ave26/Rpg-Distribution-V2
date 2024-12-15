import { TruckAvailability } from "@prisma/client";
import React, { useEffect, useState } from "react";
import {
  TOrderedProductsWBinLocations,
  TRecords,
  TTrucks,
} from "../PickingAndPackingType";
import useSWR, { mutate } from "swr";

type TLoadRecordButtonProps = {
  orderedProducts?: TOrderedProductsWBinLocations[]; // this should be the update for loading the record
  record: TRecords;
  truck: TTrucks;
  states: {
    setToastData: React.Dispatch<
      React.SetStateAction<{ message: string; show: boolean }>
    >;
    toastData: { message: string; show: boolean };
  };
};

export type TUpdateTruckData = {
  status: TruckAvailability;
};

export type TUpdateTrucks = {
  total: number;
  status: TruckAvailability;
  assignedProductIds: string[];
  truckId: string;
};

function LoadRecordButton({
  truck,
  orderedProducts,
  states,
}: TLoadRecordButtonProps) {
  const { setToastData, toastData } = states;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState<"animate-emerge" | "animate-fade">(
    "animate-fade"
  );
  const [percentage, setPercentage] = useState(0);

  console.log(orderedProducts);

  function setRecordToLoad() {
    const result = getAssignedProducts();
    if (!result) return;
    const { totalIds, totalNW } = result;

    const { status } = setTruckStatus(totalNW);
    // do something
    const data: TUpdateTrucks = {
      total: totalNW,
      status,
      assignedProductIds: totalIds,
      truckId: truck.id,
    };

    console.log(data);

    console.log("click set record to load");
    fetch("/api/outbound/update-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data: { message: string }) => {
        if (data) {
          mutate("/api/trucks/find");

          alert(data.message);
          setToastData({
            ...toastData,
            message: data.message,
            show: true,
          });
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        mutate("/api/trucks/find");
        setAnimate("animate-fade");
      });
  }

  function setTruckStatus(total: number): TUpdateTruckData {
    const newCapacity = truck.payloadCapacity - total;
    const percentage = (1 - newCapacity / truck.threshold) * 100;
    console.log(percentage);
    if (percentage === 0) {
      return { status: "Empty" };
    } else if (percentage < 50) {
      return { status: "PartialLoad" };
    } else if (percentage < 100) {
      return { status: "HalfFull" };
    } else {
      return { status: "FullLoad" };
    }
  }

  function getAssignedProducts() {
    const isArray = Array.isArray(orderedProducts);
    return (
      isArray &&
      orderedProducts?.reduce(
        (acc: { totalIds: string[]; totalNW: number }, op) => {
          const result = op.binLocations.reduce(
            (acc: { ids: string[]; netWeight: number }, bl) => {
              const pIds = bl.assignedProducts.map((ap) => ap.id);
              const netWeight = bl.quantity * bl.stockKeepingUnit.weight;
              acc.ids.push(...pIds);
              acc.netWeight += netWeight;
              return acc;
            },
            { ids: [], netWeight: 0 }
          );

          acc.totalIds.push(...result.ids);
          acc.totalNW += result.netWeight;

          return acc;
        },
        { totalIds: [], totalNW: 0 }
      )
    );
  }

  const buttonStyle =
    "rounded-sm bg-sky-300/40 w-full h-full p-2 shadow-md text-[8px] hover:bg-sky-300/10 active:bg-sky-300 uppercase font-black";

  return (
    <>
      {open && (
        <div
          className={`${animate} flex h-full gap-2`}
          onAnimationEnd={() => {
            animate === "animate-fade" && setOpen(false);
          }}
        >
          <button
            className={buttonStyle}
            onClick={() => setAnimate("animate-fade")}
          >
            Cancel
          </button>
          <button
            className={buttonStyle}
            onClick={() => {
              console.log("setting record to load");

              if (truck.status === "InTransit") {
                setAnimate("animate-fade");

                return console.log("can't load while in transit");
              }
              setRecordToLoad();

              // set a new map that consist of assignedProducts and calclate the netweight using reduce
            }}
          >
            Confirm
          </button>
        </div>
      )}

      {!open && (
        <button
          className={`${buttonStyle} ${
            animate === "animate-emerge" ? "animate-fade" : "animate-emerge"
          }`}
          onAnimationEnd={() => {
            animate === "animate-emerge" && setOpen(true);
          }}
          onClick={() => setAnimate("animate-emerge")}
        >
          Load
        </button>
      )}
    </>
  );
}

export default LoadRecordButton;
