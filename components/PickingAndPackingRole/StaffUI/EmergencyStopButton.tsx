import { buttonStyle } from "@/styles/style";
import React, { useState } from "react";
import { mutate } from "swr";
import {
  TUpdateTruckStatus,
  TUpdateTruckStatusProps,
} from "./UpdateTruckStatus";
import Loading from "@/components/Parts/Loading";

export default function EmergencyStopButton({
  states,
  truck,
}: TUpdateTruckStatusProps) {
  const { setToast } = states;
  const { truckName, id: truckId } = truck;
  const [loading, setLoading] = useState(false);

  function handleRequest() {
    const truckStatus: TUpdateTruckStatus = {
      status: "EmergencyStop",
      truckId,
      truckName,
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
      ) : truck.status === "EmergencyStop" ? (
        <p className="text-red-700">Truck Stopped</p>
      ) : (
        "Emergency Stop"
      )}
    </button>
  );
}
