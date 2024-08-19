import TruckSelection from "@/components/ReusableComponent/TruckSelection";
import React, { useState } from "react";
import CloseAllButton from "../PickingAndPackingRole/StaffUI/CloseAllButton";

export default function ViewTruckLoads() {
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <div className="h-full w-full overflow-y-scroll rounded-md bg-white p-2">
      <div className="sticky top-0 flex  select-none justify-end pb-1">
        <CloseAllButton setSelectedId={setSelectedId} />
      </div>
      <TruckSelection states={{ selectedId, setSelectedId }} />
    </div>
  );
}
