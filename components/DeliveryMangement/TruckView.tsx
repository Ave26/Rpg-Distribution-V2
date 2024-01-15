import { trucks } from "@prisma/client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import UpdateTruck from "./UpdateTruck";
import Loading from "../Parts/Loading";

async function fetcher(url: string): Promise<trucks[]> {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .catch((error) => {
      throw error;
    });
}

type TTruckViewProps = {
  states: TStates;
};

type TStates = {
  truckComponentKey: "create" | "update";
  setTruckComponentKey: React.Dispatch<
    React.SetStateAction<"create" | "update">
  >;
  selectedId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
};

export default function TruckView({ states }: TTruckViewProps) {
  const { setTruckComponentKey, setSelectedId } = states;
  const { data, isLoading } = useSWR("/api/trucks/find-trucks", fetcher, {
    refreshInterval: 1200,
  });

  const [selectTruck, setSelectTruck] = useState("");

  useEffect(() => {
    console.log(data);
  }, [data]);

  // after selecting the truck new window will pop up
  const btnStyle =
    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
  return (
    <>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center border border-black">
          <Loading />
        </div>
      ) : data?.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center border border-black">
          no trucks
        </div>
      ) : (
        data?.map((truck) => (
          <div
            onClick={() => setSelectTruck(truck.id)}
            key={truck.id}
            className="flex w-full items-center justify-between gap-2 border border-black p-2">
            <div className="flex w-full flex-shrink flex-wrap gap-2">
              <h1 className="">Truck Name:</h1>
              <p className="font-light">{truck.truckName}</p>
            </div>
            <div className="flex w-full flex-wrap gap-2">
              <h1 className="">PayLoad Capacity:</h1>
              <p className="font-light">{truck.payloadCapacity}</p>
            </div>
            <div className="flex w-full flex-wrap gap-2">
              <h1 className="">Driver`&apos;`s License:</h1>
              <p className="font-light">{truck.plate}</p>
            </div>
            <div className="flex w-full flex-wrap gap-2">
              <h1 className="">Status:</h1>
              <p className="font-light">{truck.status}</p>
            </div>

            <button
              className={btnStyle}
              onClick={() => {
                setTruckComponentKey("update");
                setSelectedId(truck.id);
              }}>
              Update
            </button>
          </div>
        ))
      )}
    </>
  );
}
