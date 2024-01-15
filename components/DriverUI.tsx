import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  TDeliveryTrigger,
  TLocationEntry,
  TCoordinates,
} from "@/types/deliveryTypes";
import { getTrucks } from "@/lib/prisma/trucks";
import { trucks as TTrucks } from "@prisma/client";
import MapRealTimeUpdate from "./MapRealTimeUpdate";
import useSWR from "swr";

type TDriverUIProps = {
  deliveryTrigger: TDeliveryTrigger;
  setDeliveryTrigger: React.Dispatch<React.SetStateAction<TDeliveryTrigger>>;
  locationEntry: TLocationEntry[] | null;
  coordinates: TCoordinates | null;
  trucks?: TTrucks[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function DriverUI({
  setDeliveryTrigger,
  deliveryTrigger,
  locationEntry,
  coordinates,
  trucks,
}: TDriverUIProps) {
  const router = useRouter();

  const { data, mutate, isLoading } = useSWR("", fetcher, {
    refreshInterval: 1200,
  });

  const [truckName, setTruckName] = useState<string>("");
  const [endPoint, setEndpoint] = useState<TCoordinates>({
    latitude: 0,
    longitude: 0,
  });

  /* 
      Initialize a short polling for rendering a dynamic data: trucks
      Display Only the trucks that has a order ids
      Select a truck whos the driver will use
      When the truck has been selected then the start delivery will be
      enabled



  */

  return (
    <div className="relative flex h-screen w-full flex-col gap-9 border border-black px-4 pt-20 font-semibold">
      <div className="absolute  right-2  top-2 flex flex-row items-center justify-center gap-2 border border-black border-transparent">
        <label htmlFor="truck">Ready Trucks</label>
        <select
          id="truck"
          name="truck"
          value={truckName}
          onChange={(e) => setTruckName(e.target.value)}
          className="block w-full min-w-[20em] rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
          {trucks?.map((truck: TTrucks) => {
            return <option key={truck?.id}>{truck.truckName}</option>;
          })}
        </select>
        <button
          onClick={() =>
            setDeliveryTrigger({
              hasStart: deliveryTrigger.hasStart ? false : true,
              name:
                deliveryTrigger.name === "Start Delivery"
                  ? "Stop Delivery"
                  : "Start Delivery",
            })
          }
          className={`${
            !deliveryTrigger.hasStart ? " bg-white/75" : " bg-pink-500"
          }  flex animate-emerge items-center justify-center rounded-md  border p-2 py-2 text-[6] transition-all hover:border hover:bg-transparent
  `}>
          <p className="animate-emerge">{deliveryTrigger.name}</p>
        </button>
      </div>

      <div className="h-44 overflow-scroll">
        {locationEntry?.map((pos, index) => (
          <h1 key={index}>
            {pos.latitude}, {pos.longitude}
          </h1>
        ))}
      </div>
      <div className="relative h-1/2 ">
        <iframe
          title="Map"
          width="100%"
          height="100%"
          //   frameBorder="0"
          src={`https://maps.google.com/maps?q=${coordinates?.latitude},${coordinates?.longitude}&output=embed`}
          allowFullScreen
          style={{ zIndex: 0 }}></iframe>
      </div>
    </div>
  );
}

export default DriverUI;

/* Once the assignedProduct is Loaded the truck will be set into Loaded */
