import useTrucks from "@/hooks/useTrucks";
import React, { useEffect, useState } from "react";
import Loading from "../../Parts/Loading";
import TruckSelection from "../../ReusableComponent/TruckSelection";
import CloseAllButton from "./CloseAllButton";
import Toast, { TToast } from "../Toast";

export default function StaffUI() {
  const [selectedId, setSelectedId] = useState("");
  const [toast, setToast] = useState<TToast>({
    animate: "animate-emerge",
    door: true,
    message: "welcome",
  });

  return (
    <div className="relative h-[60.8em] w-fit overflow-y-scroll border border-black  bg-white  p-2 shadow-md md:w-full">
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
  );
}
