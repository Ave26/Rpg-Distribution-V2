import useDeliveryLogs from "@/hooks/useDeliveryLogs";
import React, { useEffect, useRef } from "react";

function DeliveryLogs() {
  const { error, isLoading, deliveryLogs } = useDeliveryLogs();

  const scrollableRef: React.LegacyRef<HTMLDivElement> | undefined =
    useRef(null);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [deliveryLogs]);

  return (
    <div className="h-[25em] overflow-y-scroll" ref={scrollableRef}>
      {Array.isArray(deliveryLogs) &&
        deliveryLogs?.map((v) => {
          return (
            <div className="flex gap-1" key={v.id}>
              <h3 className="text-start">{v.trucks?.truckName}</h3>
              <h3
                className={`${
                  v.status === "GasStop" || v.status === "EmergencyStop"
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {v.status}
              </h3>
              <h3 className="self-center">has been initiated</h3>
              <h3 className="place-self-center">
                Latitude: {v.coordinates.latitude}
              </h3>
              <h3 className="place-self-center">
                Longitude: {v.coordinates.longitude}
              </h3>
            </div>
          );
        })}

      {Array.isArray(deliveryLogs) &&
        deliveryLogs?.map((v) => {
          return (
            <div className="flex gap-1" key={v.id}>
              <h3 className="text-start">{v.trucks?.truckName}</h3>
              <h3
                className={`${
                  v.status === "GasStop" || v.status === "EmergencyStop"
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {v.status}
              </h3>
              <h3 className="self-center">has been initiated</h3>
              <h3 className="place-self-center">
                Latitude: {v.coordinates.latitude}
              </h3>
              <h3 className="place-self-center">
                Longitude: {v.coordinates.longitude}
              </h3>
            </div>
          );
        })}
    </div>
  );
}

export default DeliveryLogs;
