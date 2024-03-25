import useTrucks from "@/hooks/useTrucks";
import React, { useEffect, useState } from "react";
import Loading from "../../Parts/Loading";
import TruckSelection from "../../ReusableComponent/TruckSelection";
import CloseAllButton from "./CloseAllButton";

export default function StaffUI() {
  const [selectedId, setSelectedId] = useState<string[]>([]);

  return (
    <section className="flex flex-col items-center justify-center md:flex-row">
      <div className="relative h-[60.8em] w-full overflow-y-scroll border border-black p-2 md:w-[90em]">
        <div className="sticky top-0 flex  select-none justify-end pb-1">
          <CloseAllButton setSelectedId={setSelectedId} />
        </div>
        <TruckSelection states={{ selectedId, setSelectedId }} />
      </div>
      <div className="w-full">skwak</div>
    </section>
  );
}
