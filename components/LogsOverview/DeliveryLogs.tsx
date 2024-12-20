import useDeliveryLogs from "@/hooks/useDeliveryLogs";
import { PDFViewer } from "@react-pdf/renderer";
import React, { useEffect, useRef } from "react";
import MyDocument from "../MyDocument";
import dynamic from "next/dynamic";
import LeafletMap from "../ReusableComponent/Map/LeafletMap";
import { buttonStyleEdge } from "@/styles/style";

interface DeliveryLogsProps {
  states: {
    setPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
    setTruckName: React.Dispatch<React.SetStateAction<string>>;
    position: [number, number];
  };
}

function DeliveryLogs({ states }: DeliveryLogsProps) {
  const { position, setPosition, setTruckName } = states;
  const { error, isLoading, deliveryLogs } = useDeliveryLogs();

  const scrollableRef: React.LegacyRef<HTMLDivElement> | undefined =
    useRef(null);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [deliveryLogs]);

  return (
    <div
      className="flex h-[25em] flex-col gap-2 overflow-y-scroll"
      ref={scrollableRef}
    >
      {Array.isArray(deliveryLogs) &&
        deliveryLogs
          ?.map((v, index) => {
            return (
              <div
                className="flex justify-between gap-1 border border-black"
                key={v.id}
              >
                <div>
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
                    Latitude: {v.coordinates?.latitude}
                  </h3>
                  <h3 className="place-self-center">
                    Longitude: {v.coordinates?.longitude}
                  </h3>
                </div>
                <button
                  className={buttonStyleEdge}
                  onClick={() => {
                    setTruckName(v.trucks.truckName);
                    setPosition([
                      v.coordinates.latitude,
                      v.coordinates.longitude,
                    ]);
                  }}
                >
                  show map
                </button>
              </div>
            );
          })
          .reverse()}
    </div>
  );
}

export default DeliveryLogs;
