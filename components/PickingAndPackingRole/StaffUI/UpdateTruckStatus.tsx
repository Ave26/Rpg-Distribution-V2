import React, { useEffect, useState } from "react";
import { TruckAvailability, productStatus, trucks } from "@prisma/client";
import Loading from "@/components/Parts/Loading";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { buttonStyle } from "@/styles/style";
import { mutate } from "swr";

type TUpdateTruckStatusProps = {
  states?: TStates;
  truck: trucks;
};

type TStates = {};

type TButtonName =
  | "Complete the Delivery"
  | "Go Back"
  | "Start Deliver"
  | "Delivery Completed"
  | null;

export default function UpdateTruckStatus({ truck }: TUpdateTruckStatusProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TruckAvailability | null>(null);

  function handleRequest() {
    // lets know this request will be persists
    console.log("touched!");
    console.log(truck.id);
    setLoading(true);
    fetch("/api/outbound/truck/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, truckId: truck.id }),
    })
      .then((res) => res.json())
      .then((data) => data && mutate("/api/trucks/find-trucks"))
      .catch((e) => e)
      .finally(() => {
        // do something

        setLoading(false);
      });
  }

  const mappedComponent: Record<TruckAvailability, TButtonName> = {
    InTransit: "Complete the Delivery",
    Empty: "Start Deliver",
    PartialLoad: "Start Deliver",
    FullLoad: "Start Deliver",
    HalfFull: null,
    Delivered: "Go Back",
    ScheduledforPickup: null,
    OnHold: null,
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
      case "Go Back":
        setStatus("Empty");
        break;
      default:
        setStatus(null);
        break;
    }

    return handleRequest();
  }, [renderButtonName]);

  return (
    <button
      className={buttonStyle}
      onClick={(e) => {
        e.stopPropagation();
        handleRequest();
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
