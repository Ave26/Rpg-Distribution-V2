import useDeliveryLogs from "@/hooks/useDeliveryLogs";
import { PDFViewer } from "@react-pdf/renderer";
import React, { useEffect, useRef } from "react";
import MyDocument from "../MyDocument";
import dynamic from "next/dynamic";
import LeafletMap from "../ReusableComponent/Map/LeafletMap";
import { buttonStyleDark, buttonStyleEdge } from "@/styles/style";

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
  // flex h-[25em] flex-col gap-2 overflow-y-scroll p-2

  return (
    <>
      {deliveryLogs &&
        Object.entries(deliveryLogs)
          .map(([truckName, logs]) => {
            return (
              <div
                key={truckName}
                className="flex h-full flex-col overflow-y-scroll rounded-md bg-white p-2 text-[8px] font-black uppercase shadow-md"
              >
                {truckName}
                {Array.isArray(logs) &&
                  logs
                    .map((v) => {
                      return (
                        <div
                          ref={scrollableRef}
                          className="flex items-center justify-start gap-1 border border-black uppercase"
                          key={v.id}
                        >
                          <div className="flex">
                            <h3 className="">{v.trucks?.truckName}</h3>
                            <h3
                              className={`${
                                v.status === "GasStop" ||
                                v.status === "EmergencyStop"
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
                            // className={`${buttonStyleDark} h-fit`}
                            className="hover:bg-slate-200"
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
          })
          .reverse()}

      {/* {Object.entries(deliveryLogs).map([])} */}
      {/* {Object.entries(deliveryLogs)
          ?.map((v, index) => {
            return (
              <div className="flex justify-between gap-1 uppercase" key={v.id}>
                <div className="flex">
                  <h3 className="">{v.trucks?.truckName}</h3>
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
                  // className={buttonStyleDark}
                  className="hover:bg-slate-200"
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
          .reverse()} */}
    </>
  );
}

export default DeliveryLogs;
