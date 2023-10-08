import { ReactElement, useEffect, useRef, useState } from "react";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { setTime } from "@/helper/_helper";

import { useMyContext } from "@/contexts/AuthenticationContext";
import VehicleManagement from "@/components/VehicleManagement";
import DriverUI from "@/components/DriverUI";

import { trucks as TTrucks } from "@prisma/client";

import {
  TCoordinates,
  TDeliveryTrigger,
  TLocationEntry,
} from "@/types/deliveryTypes";
import { getTrucks } from "@/lib/prisma/trucks";

export default function DeliveryManagement({ trucks }: { trucks: TTrucks[] }) {
  const { globalState } = useMyContext();

  const divRef = useRef<HTMLDivElement | null>(null);
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

        if (divRef.current) {
          divRef.current.scrollTop = divRef.current.scrollHeight;
        }

        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
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

  useEffect(() => {
    if (deliveryTrigger.hasStart) {
      /* 
      true ? truckStatus === outForDelivery : available | forRepair
      if truckStatus === outForDeliver

      we need a function to check what status is that
      specific truck id

      if determined as one of that 
      it will run a 3 differenct functionalities

      eg. outForDelivery
      the assigned product will be updated as OutForDelivery
      


      
      
      */
    }
  }, [deliveryTrigger.hasStart]);

  const Test = {
    Admin: VehicleManagement,
    staff: DriverUI,
  };

  return (
    <section className="relative flex h-screen w-full flex-col gap-9 px-4 py-20">
      {globalState?.verifiedToken?.roles === "Admin" ? (
        <VehicleManagement />
      ) : (
        <DriverUI
          setDeliveryTrigger={setDeliveryTrigger}
          deliveryTrigger={deliveryTrigger}
          locationEntry={locationEntry}
          coordinates={coordinates}
          divRef={divRef}
          trucks={trucks}
        />
      )}
    </section>
  );
}

export async function getServerSideProps() {
  const { trucks } = await getTrucks();

  return {
    props: { trucks },
  };
}

DeliveryManagement.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
