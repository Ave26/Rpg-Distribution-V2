import React, { useEffect, useState } from "react";
import { TToast } from "../Inventory/InventoryTypes";
import Toast from "../Parts/Toast";
import TruckView from "./TruckView";
import FormCreateTruck from "./FormCreateTruck";
import FormUpdateTruck from "./FormUpdateTruck";

export default function TruckManagement() {
  const [toast, setToast] = useState<TToast>({ message: "", show: false });
  const [selectedId, setSelectedId] = useState("");
  const [truckComponentKey, setTruckComponentKey] = useState<
    "create" | "update"
  >("create");

  useEffect(() => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      setToast({
        ...toast,
        show: false,
      });
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.show]);

  const mappedComponent = {
    create: <FormCreateTruck states={{ setToast, toast }} />,
    update: (
      <FormUpdateTruck
        states={{ setTruckComponentKey, truckComponentKey, selectedId }}
      />
    ),
  };

  const renderComponent = mappedComponent[truckComponentKey];

  useEffect(() => {
    console.log(truckComponentKey);
  }, [truckComponentKey]);

  return (
    <div className="flex h-full w-full animate-emerge flex-col items-center justify-center gap-2 p-2 text-xs transition-all md:flex-row md:items-start md:justify-start">
      <div className="flex h-full w-full flex-col items-center gap-2 border border-black p-2 transition-all md:flex-row md:items-start">
        <div className="flex h-full w-fit items-start  justify-center border border-black p-2">
          {renderComponent}
        </div>

        <div className="flex h-[40em] w-full flex-col items-center justify-start gap-[1px] overflow-y-scroll md:items-start">
          <TruckView
            states={{
              truckComponentKey,
              setTruckComponentKey,
              selectedId,
              setSelectedId,
            }}
          />
        </div>
      </div>

      <Toast isShow={toast.show} data={toast.message} />
    </div>
  );
}

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
