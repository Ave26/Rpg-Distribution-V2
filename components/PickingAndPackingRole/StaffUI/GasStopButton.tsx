import { buttonStyle } from "@/styles/style";
import React, { useState } from "react";
import {
  TUpdateTruckStatus,
  TUpdateTruckStatusProps,
} from "./UpdateTruckStatus";
import { mutate } from "swr";
import Loading from "@/components/Parts/Loading";

export default function GasStopButton({
  states,
  truck,
}: TUpdateTruckStatusProps) {
  const { setToast, coordinates } = states;
  const { truckName, id: truckId } = truck;
  const [loading, setLoading] = useState(false);

  // can only change while in transit

  function handleRequest() {
    const truckStatus: TUpdateTruckStatus = {
      status: "GasStop",
      truckId,
      truckName,
      coordinates,
    };
    const requestBody = JSON.stringify(truckStatus);

    fetch("/api/outbound/truck/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data)
          setToast({
            animate: "animate-emerge",
            door: true,
            message: data.message,
          });

        return data && mutate("/api/trucks/find-trucks");
      })
      .finally(() => setLoading(false));
  }

  return (
    <button
      className={buttonStyle}
      onClick={(e) => {
        e.stopPropagation();
        !loading && handleRequest();
      }}
    >
      {loading ? (
        <div className="flex h-[2em] items-center justify-center">
          <Loading />
        </div>
      ) : truck.status === "GasStop" ? (
        <p className="text-red-700">Truck Stopped</p>
      ) : (
        "Gas Stop"
      )}
    </button>
  );
}
