import React, { useEffect, useState } from "react";
// PRISMA TYPES
import {
  trucks as TTrucks,
  TruckAvailability as TTruckAvailability,
  TruckAvailability,
} from "@prisma/client";
import useSWR from "swr";

// ICONS
import { FaBackspace } from "react-icons/fa";
// COMPONENT
import Loading from "./Parts/Loading";

export default function VehicleManagement() {
  const [isClick, setIsClick] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [addTruckOnLoad, setAddTruckOnLoad] = useState(false);
  const [updateTruckOnLoad, setUpdateTruckOnLoad] = useState(false);
  const [truckData, setTruckData] = useState<TTrucks>({
    id: "",
    name: "",
    status: "Available",
  });
  const truckAvailabity = ["Available", "ForRepair", "OutForDelivery"];

  const fetchTrucks = async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: TTrucks[] = await response.json();
    return data;
  };

  const {
    data: trucks,
    isLoading,
    mutate,
  } = useSWR("/api/trucks/find-trucks", fetchTrucks);

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
          +{Number(trucks?.length)}
        </h1>
      </div>

      <div className="relative flex w-full flex-row gap-2 overflow-scroll p-2 transition-all">
        <div className="flex w-full flex-col items-center justify-start gap-2 ">
          {trucks?.map((truck) => {
            return (
              <div
                key={truck?.id}
                className="flex w-full flex-row justify-between border p-2">
                <h1 className="p-2 text-center">Name: {truck?.name}</h1>
                <h1 className="p-2 text-center">Status: {truck?.status}</h1>
                <button
                  onClick={async () => {
                    setIsOpen(true);
                    setTruckData({
                      id: truck.id,
                      name: truck?.name,
                      status: truck.status,
                    });
                  }}
                  className="rounded-lg border p-2">
                  Update
                </button>
              </div>
            );
          })}
        </div>

        {isOpen && (
          <div
            className={`relative p-3 transition-all ${
              isOpen ? "animate-emerge" : "animate-fade"
            } absolute h-full w-full  border bg-slate-900/30`}>
            <h1 className="text-2xl font-bold">Truck Name: {truckData.name}</h1>
            <div className="flex flex-col gap-2 p-2">
              <label htmlFor="truckStatus">Truck Status</label>
              <select
                id="truckStatus"
                value={truckData.status}
                onChange={(e) =>
                  setTruckData({
                    ...truckData,
                    status: e.target.value as TTruckAvailability,
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
              {/* Confirm */}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
