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
  const newStatus = Object.values(TruckAvailability).filter(
    (value) => value === "Delivered" || "Empty"
  );

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
    Delivered: "Delivery Completed",
    ScheduledforPickup: null,
    OnHold: null,
  };

  const renderComponent = mappedComponent[truck.status];

  useEffect(() => {
    if (renderComponent === "Complete the Delivery") {
      setStatus("Delivered");
      return handleRequest();
    } else if (renderComponent === "Start Deliver") {
      setStatus("InTransit");
      return handleRequest();
    } else if (renderComponent === "Delivery Completed") {
      setStatus("Empty");
      return handleRequest();
    }
  }, [renderComponent]);

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
        renderComponent
      )}
    </button>
  );
}
