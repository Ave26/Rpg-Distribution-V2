import React, { useEffect, useState } from "react";
import { TToast } from "../Inventory/InventoryTypes";
import Toast from "../Parts/Toast";
import TruckView from "./TruckView";
import FormUpdateTruck from "./FormUpdateTruck";
import { TSelectedTruck } from "./deliveryManagementTypes";
import FormCreateTruck from "./FormCreateTruck";

type TTruckComponent = "create" | "update";

export default function TruckManagement() {
  const [toast, setToast] = useState<TToast>({ message: "", show: false });
  const [selectedTruck, setSelectedTruck] = useState<TSelectedTruck>({
    id: "",
    truckName: "",
    truckStatus: "Empty",
  });

  const [truckComponentKey, setTruckComponentKey] =
    useState<TTruckComponent>("create");

  useEffect(() => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      setToast((prevState) => ({ ...prevState, show: false }));
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.show]);

  const mappedComponent = {
    create: <FormCreateTruck states={{ setToast, toast }} />,
    update: (
      <FormUpdateTruck
        states={{
          setTruckComponentKey,
          truckComponentKey,
          selectedTruck,
          setToast,
        }}
      />
    ),
  };
  const renderComponent = mappedComponent[truckComponentKey];
  /* flex h-full w-full flex-col items-center justify-center gap-2  text-xs transition-all md:flex-row md:items-start md:justify-start */
  /* flex h-full w-full flex-col items-center gap-2 border border-black transition-all md:flex-row md:items-start */
  return (
    <>
      {/* flex h-full w-full items-start justify-center rounded-md bg-white p-2 drop-shadow-sm md:w-fit */}
      <div className="h-full rounded-md bg-white font-black uppercase sm:w-[50%]">
        {renderComponent}
      </div>

      <div className="flex h-full w-full flex-col gap-[1.5px] overflow-y-scroll rounded-md bg-white p-2 shadow-md md:min-h-full">
        <TruckView
          states={{
            truckComponentKey,
            setTruckComponentKey,
            selectedTruck,
            setSelectedTruck,
          }}
        />
      </div>

      <Toast isShow={toast.show} data={toast.message} />
    </>
  );
}
// flex h-[40em] w-full flex-col items-center justify-start gap-[1px] overflow-y-scroll md:items-start
/* 
  Empty: Indicates that the truck is not carrying any cargo at the moment.
  Partial Load: Indicates that the truck is carrying some cargo, but it is not fully loaded.
  Full Load: Indicates that the truck is carrying its maximum capacity of cargo.
  Half Full: Indicates that the truck is carrying cargo, and it is halfway to its full capacity.
  In Transit: Indicates that the truck is currently on the move, transporting the assigned cargo.
  Delivered: Indicates that the cargo has been successfully delivered, and the truck is empty or awaiting the next assignment.
  Scheduled for Pickup:   Indicates that the truck is assigned to pick up cargo at a specific location.
  On Hold: Indicates that the truck is temporarily not in use or has been put on hold for maintenance or other reasons.
*/
