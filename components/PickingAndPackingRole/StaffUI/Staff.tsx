import useTrucks from "@/hooks/useTrucks";
import React, { useEffect, useState } from "react";
import Loading from "../../Parts/Loading";
import TruckSelection from "../../ReusableComponent/TruckSelection";
import CloseAllButton from "./CloseAllButton";
import Toast, { TToast } from "../Toast";

export default function StaffUI() {
  // const [selectedId, setSelectedId] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [toast, setToast] = useState<TToast>({
    animate: "animate-emerge",
    door: true,
    message: "skwak",
  });

  return (
    <section className="flex flex-col items-center justify-center md:flex-row md:justify-start">
      <div className="relative h-[60.8em] w-full overflow-y-scroll  bg-white  p-2 shadow-md md:w-full">
        <div className="sticky top-0 flex  select-none justify-end pb-1">
          <CloseAllButton setSelectedId={setSelectedId} />
        </div>
        <TruckSelection states={{ selectedId, setSelectedId }} />
        <Toast
          states={{
            setToast,
            toast,
          }}
        />
      </div>
    </section>
  );
}
