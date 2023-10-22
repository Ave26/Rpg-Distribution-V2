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
import useMapComponent from "@/hooks/useMapComponent";

type TDeliveryManagementProps = {
  trucks: TTrucks[];
};

export default function DeliveryManagement({
  trucks,
}: TDeliveryManagementProps) {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.roles;

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

  const mapComponent = {
    SuperAdmin: () => <VehicleManagement />,
    Admin: () => <VehicleManagement />,
    Staff: () => undefined,
    Driver: () => (
      <DriverUI
        setDeliveryTrigger={setDeliveryTrigger}
        deliveryTrigger={deliveryTrigger}
        locationEntry={locationEntry}
        coordinates={coordinates}
        trucks={trucks}
      />
    ),
  };

  const { MappedComponent } = useMapComponent(mapComponent);
  return (
    <section className="relative flex h-screen w-full flex-col gap-9 px-4 py-20">
      {MappedComponent}
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

/* 
  When the Start Delivery is Triggered
    - Update The Truck that has the products in queue
    - How to know where the product I will going to update
    const updateSpecificTruck = await prisma.trucks.findMany({
      where: {
        
      }
    })
*/
