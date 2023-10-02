import { ReactElement, useEffect, useState } from "react";
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
  const [coordinates, setCoordinates] = useState<TCoordinates | null>(null);
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

        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

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
    <section className="relative flex h-screen w-full flex-col gap-9 border border-black px-4 pt-20">
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
        } absolute right-2 top-2 flex animate-emerge items-center justify-center rounded-md  border border-transparent p-2 py-2 text-[6] transition-all hover:border hover:bg-transparent
          `}>
        <p className="animate-emerge">{deliveryTrigger.name}</p>
      </button>
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
          frameBorder="0"
          src={`https://maps.google.com/maps?q=${coordinates?.latitude},${coordinates?.longitude}&output=embed`}
          allowFullScreen
          style={{ zIndex: 0 }}></iframe>
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
