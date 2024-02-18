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

export default function UpdateTruckStatus({ truck }: TUpdateTruckStatusProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TruckAvailability>("InTransit");

  function handleRequest() {
    // lets know this request will be persists
    console.log(truck.id);
    setLoading(true);
    fetch("/api/outbound/truck/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, truckId: truck.id }),
    })
      .then((res) => res.json())
      .then((data) => mutate("/api/trucks/find-trucks"))
      .catch((e) => e)
      .finally(() => {
        // do something
        setLoading(false);
      });
  }

  useEffect(() => {
    console.log(truck.status);
  }, [truck.id]);

  const mappedComponent: Record<TruckAvailability, string | null> = {
    InTransit: "Go Back",
    Empty: null,
    PartialLoad: null,
    FullLoad: "Start Deliver",
    HalfFull: null,
    Delivered: null,
    ScheduledforPickup: null,
    OnHold: null,
  };

  const renderComponent = mappedComponent[truck.status];

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
