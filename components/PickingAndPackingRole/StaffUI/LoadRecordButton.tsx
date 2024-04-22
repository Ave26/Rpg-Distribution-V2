import { orderedProducts, orderedProductsTest } from "@prisma/client";
import React, { useState } from "react";
import { TRecords, TTrucks } from "../PickingAndPackingType";
import { mutate } from "swr";

type TLoadRecordButtonProps = {
  orderedProduct: orderedProductsTest;
  record: TRecords;
  truck: TTrucks;
  states?: TStates;
};

type TStates = {};

function LoadRecordButton({
  orderedProduct,
  record,
  truck,
}: TLoadRecordButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState<"animate-emerge" | "animate-fade">(
    "animate-fade"
  );
  function setRecordToLoad() {
    console.log("click set record to load");
    fetch("/api/outbound/update-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: record?.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // setToastData({
        //   ...toastData,
        //   message: data.message,
        //   show: true,
        // });

        mutate("/api/trucks/find-trucks");
      })
      .catch((e) => console.log(e))
      .finally(() => setAnimate("animate-fade"));
  }

  /* 
   To find the current capacity, simply negate the current capacity into payloadCapacity
  */
  // function test
  function setTruckStatus(currentCapacity: number, threshold: number): string {
    const percentage = (currentCapacity / threshold) * 100;
    if (percentage === 0) {
      console.log("empty");
      return "empty";
    } else if (percentage < 50) {
      console.log("partial");
      return "partial";
    } else if (percentage === 50) {
      console.log("halfFull");
      return "halfFull";
    } else {
      console.log("full");
      return "full";
    }
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
            onClick={() => setTruckStatus(1600, 3200)}
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
