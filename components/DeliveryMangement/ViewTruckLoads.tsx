import TruckSelection from "@/components/UsableComponent/TruckSelection";
import useTrucks from "@/hooks/useTrucks";
import React, { useState } from "react";
import useSWR from "swr";

function ViewTruckLoads() {
  const [selectedId, setSelectedId] = useState<string[]>([]);

  return (
    <div className="h-full w-full animate-emerge overflow-y-scroll border border-black p-2">
      <TruckSelection states={{ selectedId, setSelectedId }} />
    </div>
  );
}

export default ViewTruckLoads;
