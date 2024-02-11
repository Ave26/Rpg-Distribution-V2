import useTrucks from "@/hooks/useTrucks";
import React, { useEffect, useState } from "react";
import Loading from "../../Parts/Loading";
import TruckSelection from "../../UsableComponent/TruckSelection";
import CloseAllButton from "./CloseAllButton";

export default function StaffUI() {
  const [selectedId, setSelectedId] = useState<string[]>([]);

  const btnStyle =
    "text-white bg-blue-700 w-full hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 h-10 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";

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
