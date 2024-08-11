import { TruckAvailability } from "@prisma/client";
import React, { useEffect, useState } from "react";
import {
  TOrderedProductsWBinLocations,
  TRecords,
  TTrucks,
} from "../PickingAndPackingType";
import useSWR, { mutate } from "swr";

type TLoadRecordButtonProps = {
  orderedProduct: TOrderedProductsWBinLocations;
  record: TRecords;
  truck: TTrucks;
  states?: TStates;
};

type TStates = {};

export type TUpdateTruckData = {
  status: TruckAvailability;
};

export type TUpdateTrucks = {
  total: number;
  status: TruckAvailability;
  assignedProductIds: string[];
  truckId: string;
};

function LoadRecordButton({ orderedProduct, truck }: TLoadRecordButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState<"animate-emerge" | "animate-fade">(
    "animate-fade"
  );
  const [percentage, setPercentage] = useState(0);

  function setRecordToLoad() {
    const { assignedProductIds, total } = getAssignedProducts();
    const { status } = setTruckStatus(total);
    // do something
    const data: TUpdateTrucks = {
      total,
      status,
      assignedProductIds: assignedProductIds,
      truckId: truck.id,
    };

    console.log("click set record to load");
    fetch("/api/outbound/update-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          mutate("/api/trucks/find-trucks");
          // setToastData({
          //   ...toastData,
          //   message: data.message,
          //   show: true,
          // });
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setAnimate("animate-fade"));
  }

  /* 
    To find the current capacity, simply negate the current capacity into payloadCapacity
  */

  // NOTE: THE CURRENT CAPACITY WILL BE THE TOTAL ACCUMULATED IN ONE RECORD
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
    const result = orderedProduct.binLocations.reduce(
      (
        accumulator: { assignedProductIds: string[]; total: number },
        binLocation
      ) => {
        // Extract product IDs and add them to the assignedProductIds array
        const productIds = binLocation.assignedProducts.map(
          (assignedProduct) => assignedProduct.id
        );
        accumulator.assignedProductIds.push(...productIds);

        // Calculate the total weight
        accumulator.total +=
          binLocation.quantity * binLocation.stockKeepingUnit.weight;

        return accumulator;
      },
      { assignedProductIds: [], total: 0 }
    );
    return result;
  }

  /* 
    currentCapacity = quantity * threshold
   TODO: UPDATE -> status && payloadCapacity

   after updating the trucks

   put the name of the trucks in the assignedProducts
   update the status of the assignedProducts

   status  || capacity  || assignedProductIds

  */
  const buttonStyle =
    "rounded-sm bg-sky-300/40 w-full h-full p-2 shadow-md text-[8px] hover:bg-sky-300/10 active:bg-sky-300 uppercase font-black";

  useEffect(() => {
    console.log(JSON.stringify(orderedProduct, null, 2));
  }, []);

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

/* 
   TODO: NEED TO UPDATE ALL THE ASSIGNED PRODUCT INSIDE THE BINLOCATIONS
  MAKE THE BIN LOCATIONS SELECTABLE SO THAT THE USER WILL HAVE TO CHOOSE WANT TO LOAD

  
  CHALLENGES: IS IT GOING TO LOAD ALL THE ASSIGNED PRODUCT COMING FROM THE BINS LOCATIONS BASED ON THE PRDERED PRODUCTS
  THE PLAN IS TO TAKE THE IDs OF ASSIGNED PRODUCT AND MAKE A NEW MAP FOR IT
  AND SEND IT TO THE SERVER TO FURTHER PROCESS IT

*/
