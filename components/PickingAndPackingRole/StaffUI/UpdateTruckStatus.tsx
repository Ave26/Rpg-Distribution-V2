import React, { useEffect, useState } from "react";
import {
  Coordinates,
  TruckAvailability,
  productStatus,
  trucks,
} from "@prisma/client";
import Loading from "@/components/Parts/Loading";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { buttonStyle } from "@/styles/style";
import { mutate } from "swr";
import { TToast } from "../Toast";

export type TUpdateTruckStatusProps = {
  states: TStates;
  truck: trucks;
};

type TStates = {
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
  coordinates: Coordinates;
};

export type TUpdateTruckStatus = {
  status: TruckAvailability;
  truckId: string;
  truckName: string;
  coordinates: Coordinates;
};

type TButtonName =
  | "Complete the Delivery"
  | "Return"
  | "Start Deliver"
  | "Delivery Completed"
  | null;

export default function UpdateTruckStatus({
  truck,
  states,
}: TUpdateTruckStatusProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TruckAvailability | null>(null);
  const { setToast, coordinates } = states;

  function handleRequest() {
    setLoading(true);

    fetch("/api/outbound/truck/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        truckId: truck.id,
        truckName: truck.truckName,
        coordinates,
      }),
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
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }

  const mappedComponent: Record<TruckAvailability, TButtonName> = {
    InTransit: "Complete the Delivery",
    Empty: "Start Deliver",
    PartialLoad: "Start Deliver",
    FullLoad: "Start Deliver",
    HalfFull: "Start Deliver",
    Delivered: "Return",
    ScheduledforPickup: null,
    OnHold: null,
    EmergencyStop: "Start Deliver",
    GasStop: "Start Deliver",
  };

  const renderButtonName = mappedComponent[truck.status];

  useEffect(() => {
    switch (renderButtonName) {
      case "Complete the Delivery":
        setStatus("Delivered");
        break;
      case "Start Deliver":
        setStatus("InTransit");
        break;
      case "Return":
        setStatus("Empty");
        break;
      default:
        setStatus(null);
        break;
    }
  }, [renderButtonName]);

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
      ) : (
        <div className="flex h-[2em] w-fit items-center justify-center text-center">
          {renderButtonName}
        </div>
      )}
    </button>
  );
}
