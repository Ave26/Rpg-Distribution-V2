import { ReactElement, useEffect, useState } from "react";
import PickingAndPacking from "./picking-and-packing";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { setTime } from "@/helper/_helper";

type TCoordinates = {
  latitude: number;
  longitude: number;
};

type TLocationEntry = TCoordinates & {
  timestamp: Date;
  message: string;
};

type TDeliveryTrigger = {
  name: "Start Delivery" | "Stop Delivery";
  hasStart: boolean;
};

export default function DeliveryManagement() {
  const [locationEntry, setLocationEntry] = useState<TLocationEntry[] | null>(
    null
  );
  const [positionErrorMsg, setPositionErrorMsg] = useState<
    GeolocationPositionError[] | null
  >(null);
  const [deliveryTrigger, setDeliveryTrigger] = useState<TDeliveryTrigger>({
    hasStart: false,
    name: "Start Delivery",
  });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { date } = setTime();
        let newLocationEntry: TLocationEntry = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          message: "test",
          timestamp: date,
        };

        setLocationEntry((prevLocationEntry) =>
          prevLocationEntry
            ? [...prevLocationEntry, newLocationEntry]
            : [newLocationEntry]
        );

        // Moved this line inside the callback
        console.log("works only if hasStart is true"); // Also moved this line inside the callback
      },
      (error) => {
        setPositionErrorMsg([error]);
      }
    );
    if (!deliveryTrigger.hasStart) {
      return navigator.geolocation.clearWatch(watchId);
    }
    console.log(watchId, locationEntry);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [deliveryTrigger.hasStart]);
  return (
    <section className="relative h-screen w-full">
      <button
        onClick={() =>
          deliveryTrigger.name === "Start Delivery"
            ? setDeliveryTrigger({
                hasStart: true,
                name: "Stop Delivery",
              })
            : setDeliveryTrigger({
                hasStart: false,
                name: "Start Delivery",
              })
        }
        className={`${
          !deliveryTrigger.hasStart ? " bg-white/75" : " bg-pink-500"
        } absolute right-2 top-2 flex animate-emerge items-center justify-center rounded-md  border border-transparent p-2 py-2 text-[6] transition-all hover:border hover:bg-transparent
          `}>
        <p className="animate-emerge">{deliveryTrigger.name}</p>
      </button>

      <div>
        {locationEntry?.map((pos, index) => (
          <h1 key={index}>
            {pos.latitude}, {pos.longitude}
          </h1>
        ))}
      </div>
    </section>
  );
}

DeliveryManagement.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
