import React, { useEffect, useState } from "react";
import {
  Coordinates,
  TruckAvailability,
  assignedProducts,
  binLocations,
  orderedProducts,
  ProductStatus,
  records,
  stockKeepingUnit,
  trucks,
} from "@prisma/client";
import Loading from "@/components/Parts/Loading";
import { buttonStyle } from "@/styles/style";
import { mutate } from "swr";
import { TToast } from "../Toast";
import { Truck } from "@/pages/api/outbound/truck/update-status";
import { ProductData } from "@/pages/api/outbound/product/update-status";

export type TUpdateTruckStatusProps = {
  states: TStates;
  truck: Trucks;
  enableGeolocation?: () => void;
};

type Trucks = trucks & {
  records: Records[];
};

type Records = records & {
  orderedProducts: OrderedProducts[];
};

type OrderedProducts = orderedProducts & {
  binLocations: BinLocations[];
};

type BinLocations = binLocations & {
  stockKeepingUnit: stockKeepingUnit;
  assignedProducts: assignedProducts[];
};

type TStates = {
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
  coordinates: Coordinates;
};

export type TUpdateProductStatus = {
  truckId?: string;
  data?: {
    binLocationIds?: string[];
    total?: number;
  };
};

export type TUpdateTruckStatus = {
  status: TruckAvailability;
  truckId: string;
  truckName: string;
  coordinates: Coordinates;
};

type TButtonName =
  | "Complete the Delivery"
  | "Return"
  | "Start Deliver"
  | "Delivery Completed"
  | "Home"
  | null;

export default function UpdateTruckStatus({
  truck,
  states,
  enableGeolocation,
}: TUpdateTruckStatusProps) {
  const [loading, setLoading] = useState(false);
  const { setToast, coordinates } = states;
  const [truckform, setTruckForm] = useState<Truck>({
    coordinates: { latitude: 0, longitude: 0 },
    status: "InTransit",
    truckId: "",
    truckName: "",
  });

  function getBinIdAndTotal(): ProductData {
    console.log("selected truck id");
    // const truck = trucks?.find((truck) => truck.id === truckId);

    const takeTotalAndBinLocId = truck?.records.flatMap((record) => {
      return record.orderedProducts.flatMap((orderedProduct) =>
        orderedProduct.binLocations.map((binLocation) => {
          // take the length of the good product as quantity
          const testCount = binLocation.assignedProducts.filter(
            (ap) => ap.quality === "Good" && ap.status === "Loaded"
          ).length;

          console.log(testCount);
          const test = binLocation.assignedProducts.filter((ap) => {
            ap.quality === "Good" && ap.status === "Loaded";
          });
          const total =
            binLocation.stockKeepingUnit.weight * binLocation.quantity;
          return {
            binLoc: binLocation.id,
            total: testCount,
          };
        })
      );
    });

    const accumulateIntoOne = takeTotalAndBinLocId?.reduce(
      (accumulator: { total: number; binLocationIds: string[] }, initial) => {
        accumulator.total += initial.total;
        accumulator.binLocationIds.push(initial.binLoc);
        return accumulator;
      },
      { total: 0, binLocationIds: [] }
    );

    const { binLocationIds, total } = accumulateIntoOne;
    console.log(accumulateIntoOne);

    return { binLocationIds, total };
  }

  function handleRequest({ binLocationIds, total }: ProductData) {
    setLoading(true);
    const form: Truck = truckform;
    // updateTruckStatus();
    console.log(form);

    try {
      fetch("/api/outbound/truck/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productData: { binLocationIds, total } as ProductData,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((e) => console.error(e))
        .finally(() => {
          mutate("/api/trucks/find");
          setLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
  }

  const mappedComponent: Record<TruckAvailability, TButtonName> = {
    InTransit: "Complete the Delivery",
    Empty: "Start Deliver",
    PartialLoad: "Start Deliver",
    FullLoad: "Start Deliver",
    HalfFull: "Start Deliver",
    Delivered: "Return",
    ScheduledforPickup: null,
    OnHold: null,
    EmergencyStop: "Start Deliver",
    GasStop: "Start Deliver",
    Returning: "Home",
  };

  const renderButtonName = mappedComponent[truck.status]; // await the truck status

  useEffect(() => {
    setTruckForm((prev) => {
      switch (renderButtonName) {
        case "Start Deliver":
          return {
            ...prev,
            status: "InTransit",
            truckId: truck.id,
            truckName: truck.truckName,
            coordinates,
          };
        case "Complete the Delivery":
          return {
            ...prev,
            status: "Delivered",
            truckId: truck.id,
            truckName: truck.truckName,
            coordinates,
          };
        case "Home":
          return {
            ...prev,
            status: "Empty",
            truckId: truck.id,
            truckName: truck.truckName,
            coordinates,
          };
        case "Return":
          return {
            ...prev,
            status: "Returning",
            truckId: truck.id,
            truckName: truck.truckName,
            coordinates,
          };
        default:
          return {
            ...prev,
            status: "Empty",
            truckId: truck.id,
            truckName: truck.truckName,
          };
      }
    });
  }, [renderButtonName, truck.id, truck.truckName, coordinates]);

  // useEffect(() => {
  //   switch (renderButtonName) {
  //     case "Start Deliver":
  //       return setTruckForm({
  //         ...truckform,
  //         status: "InTransit",
  //         truckId: truck.id,
  //         truckName: truck.truckName,
  //         coordinates,
  //       });
  //     case "Complete the Delivery":
  //       return setTruckForm({
  //         ...truckform,
  //         status: "Delivered",
  //         truckId: truck.id,
  //         truckName: truck.truckName,
  //         coordinates,
  //       });

  //     case "Home":
  //       return setTruckForm({
  //         ...truckform,
  //         status: "Empty",
  //         truckId: truck.id,
  //         truckName: truck.truckName,
  //         coordinates,
  //       });
  //     case "Return":
  //       return setTruckForm({
  //         ...truckform,
  //         status: "Returning",
  //         truckId: truck.id,
  //         truckName: truck.truckName,
  //         coordinates,
  //       });

  //     default:
  //       return setTruckForm({
  //         ...truckform,
  //         status: "Empty",
  //         truckId: truck.id,
  //         truckName: truck.truckName,
  //       });
  //   }
  // }, [renderButtonName]);

  return (
    <button
      className={buttonStyle}
      onClick={(e) => {
        e.stopPropagation();
        // enableGeolocation();
        const { binLocationIds, total } = getBinIdAndTotal();

        !loading && handleRequest({ binLocationIds, total });

        console.log("change the name of the status");
      }}
    >
      {loading ? (
        <div className="flex h-[2em] items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex h-[2em] w-fit items-center justify-center text-center">
          {renderButtonName}
        </div>
      )}
    </button>
  );
}
