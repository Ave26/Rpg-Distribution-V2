import React, { useEffect, useState } from "react";
import {
  trucks,
  records,
  TruckAvailability,
  orderedProducts,
  assignedProducts,
  products,
  bins,
} from "@prisma/client";
import useSWR from "swr";

import Cargo from "./DeliveryMangement/Admin/Cargo";
import { FaBackspace } from "react-icons/fa";
import Loading from "./Parts/Loading";

type TOmitTrucks = Omit<trucks, "driverId" | "capacity" | "routeCluster">;
type TOmitRecord = Omit<
  records,
  "clientName" | "dateCreated" | "destination" | "username" | "truckName"
>;

type TTrucks = TOmitTrucks & {
  records: TOmitRecord[];
};

type TData = {
  trucks: TTrucks[];
  bins: bins[];
};

type TCargo = {
  animate: boolean;
  style: "animate-emerge" | "animate-fade";
};

export default function VehicleManagement() {
  const [isClick, setIsClick] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCargoOpen, setIsCargoOpen] = useState<TCargo>({
    animate: false,
    style: "animate-fade",
  });
  const [addTruckOnLoad, setAddTruckOnLoad] = useState(false);
  const [updateTruckOnLoad, setUpdateTruckOnLoad] = useState(false);

  const [truckData, setTruckData] = useState<TTrucks>({
    id: "",
    name: "",
    status: "Available",
    records: [],
    routeClusterId: "",
  });

  const truckAvailabity = [
    "Available",
    "Loaded",
    "ForRepair",
    "OutForDelivery",
  ];

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: TData = await response.json();

    return data;
  };

  const { data, isLoading, mutate } = useSWR(
    "/api/trucks/find-trucks-admin",
    fetcher,
    {
      refreshInterval: 1200,
    }
  );

  async function addTrucks() {
    setAddTruckOnLoad(true);
    try {
      const res = await fetch("/api/trucks/add-trucks", {
        method: "POST",
      });

      res.ok && mutate();
    } catch (e) {
      console.log(e);
    } finally {
      setAddTruckOnLoad(false);
      setIsClick(false);
    }
  }

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  const inputStyle =
    "border border-none bg-white/70 p-4 outline-none backdrop-blur-sm rounded-sm";

  const buttonStyle =
    "ounded-sm border border-transparent p-2 hover:border-white/60";
  return (
    <div className="flex h-full w-full flex-col gap-2 border border-dotted p-2 font-semibold">
      <div className="flex select-none gap-2">
        {isClick ? (
          <div className="flex animate-emerge gap-2 p-2 transition-all  ">
            <button onClick={() => setIsClick(false)} className={buttonStyle}>
              Cancel
            </button>
            <button onClick={addTrucks} className={buttonStyle}>
              Confirm
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsClick(true)}
            className="relative flex h-fit w-fit animate-emerge items-center justify-center rounded-md border bg-white/30 p-2 text-center transition-all active:bg-cyan-300 active:backdrop-blur-md">
            Add Trucks
          </button>
        )}
        <h1 className="flex items-center justify-center border p-2">
          +{Number(data?.trucks?.length)}
        </h1>

        {/* <input name={} value={}/> */}
      </div>

      <div
        className={`relative overflow-hidden ${
          isCargoOpen.animate || "overflow-y-scroll"
        } flex h-80 w-full flex-wrap gap-4 border border-black bg-slate-400`}>
        {data
          ? data.trucks?.map((truck: TTrucks) => {
              return (
                <div
                  key={truck.id}
                  className="flex w-full items-center justify-between gap-3 rounded-md border border-transparent bg-sky-50/90 p-2 text-black">
                  <div className="flex h-full w-full flex-col items-start justify-center ">
                    <h1>{truck.name}</h1>
                    <h1>{truck.status}</h1>
                  </div>
                  <div>
                    {data?.bins?.map((bin) => {
                      return (
                        <>
                          {bin.row} - {bin.shelfLevel}
                        </>
                      );
                    })}
                  </div>

                  <div className="W-full flex items-center justify-center ">
                    <button
                      onClick={async () => {
                        setIsCargoOpen({
                          ...isCargoOpen,
                          animate: true,
                          style: "animate-emerge",
                        });

                        setTruckData({
                          id: truck.id,
                          name: truck.name,
                          status: truck.status,
                          records: truck.records.map((record) => ({
                            id: record.id,
                            batchNumber: record.batchNumber,
                            poId: record.poId,
                          })),
                          routeClusterId: "",
                        });
                      }}
                      className="h-fit w-fit whitespace-nowrap rounded-lg border bg-slate-600/30 p-2">
                      Show Cargo
                    </button>
                    <button
                      onClick={async () => {
                        setIsOpen(true);

                        // setTruckData({
                        //   id: truck.id,
                        //   name: truck.name,
                        //   status: truck.status,
                        //   records: truck.records.map((record) => ({
                        //     id: record.id,
                        //   })),
                        //   routeClusterId: "",
                        // });
                      }}
                      className="h-fit w-fit rounded-lg border bg-slate-600/30 p-2">
                      Update
                    </button>
                  </div>
                </div>
              );
            })
          : "No Data"}
        {isCargoOpen.animate && (
          <Cargo
            dataCargo={{ isCargoOpen, setIsCargoOpen }}
            truckData={truckData}
          />
        )}
      </div>

      {isOpen && (
        <div
          className={`relative p-3 transition-all ${
            isOpen ? "animate-emerge" : "animate-fade"
          } absolute h-fit w-full  border bg-slate-900/30`}>
          <h1 className="text-2xl font-bold">Truck Name: {truckData.name}</h1>
          <div className="flex flex-col gap-2 p-2">
            <label htmlFor="truckStatus">Truck Status</label>
            <select
              id="truckStatus"
              value={truckData.status}
              onChange={(e) =>
                setTruckData({
                  ...truckData,
                  status: e.target.value as TruckAvailability,
                })
              }
              className="block w-full min-w-[20em] rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
              {truckAvailabity.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="absolute right-2 top-2 h-fit w-fit">
            <FaBackspace className="h-[20px] w-[20px]" />
          </button>
          <button
            onClick={async () => {
              try {
                setUpdateTruckOnLoad(true);
                const res = await fetch("/api/trucks/update-trucks", {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ truckData }),
                });
                console.log(res);
              } catch (e) {
                console.log(e);
              } finally {
                setUpdateTruckOnLoad(false);

                !updateTruckOnLoad &&
                  (() => {
                    setIsOpen(false);
                    mutate();
                  })();
              }
            }}
            className="flex h-[3em] w-[5em] items-center justify-center rounded-sm border p-2 text-center font-bold">
            {updateTruckOnLoad ? <Loading /> : "Confirm"}
          </button>
        </div>
      )}
    </div>
  );
}
