import { buttonStyle } from "@/styles/style";
import React, { useState } from "react";
import { mutate } from "swr";
import { TUpdateTruckStatusProps } from "./UpdateTruckStatus";
import Loading from "@/components/Parts/Loading";

export default function EmergencyStopButton({
  states,
  truck,
  enableGeolocation,
}: TUpdateTruckStatusProps) {
  const { setToast, coordinates, disabled } = states;
  const { truckName, id: truckId } = truck;
  const [loading, setLoading] = useState(false);

  function handleRequest() {
    const form = {
      coordinates,
      truckId,
    };

    fetch("/api/outbound/truck/emergency-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        res.ok && alert(data.message);
      })
      .finally(() => {
        setLoading(false);
        mutate("/api/trucks/find-trucks");
      });
  }

  return (
    <button
      className={buttonStyle}
      disabled={disabled}
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
