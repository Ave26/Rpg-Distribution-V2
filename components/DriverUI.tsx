import React, { useState } from "react";

import {
  TDeliveryTrigger,
  TLocationEntry,
  TCoordinates,
} from "@/types/deliveryTypes";
import { getTrucks } from "@/lib/prisma/trucks";
import { trucks as TTrucks } from "@prisma/client";
import MapRealTimeUpdate from "./MapRealTimeUpdate";

type TDriverUIProps = {
  deliveryTrigger: TDeliveryTrigger;
  setDeliveryTrigger: React.Dispatch<React.SetStateAction<TDeliveryTrigger>>;
  locationEntry: TLocationEntry[] | null;
  coordinates: TCoordinates | null;
  divRef: React.MutableRefObject<HTMLDivElement | null>;
  trucks: TTrucks[];
};

function DriverUI({
  setDeliveryTrigger,
  deliveryTrigger,
  locationEntry,
  coordinates,
  divRef,
  trucks,
}: TDriverUIProps) {
  const [truckName, setTruckName] = useState<string>("");
  const [endPoint, setEndpoint] = useState<TCoordinates>({
    latitude: 0,
    longitude: 0,
  });

  return (
    <div className="relative flex h-screen w-full flex-col gap-9 border border-black px-4 pt-20">
      <div className="absolute right-2 top-2 flex flex-row gap-2 border border-black border-transparent">
        <select
          name="truck"
          value={truckName}
          onChange={(e) => setTruckName(e.target.value)}
          className="block w-full min-w-[20em] rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
          {trucks?.map((truck) => {
            return <option key={truck?.id}>{truck.name}</option>;
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

      <div className="h-44 overflow-scroll" ref={divRef}>
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
