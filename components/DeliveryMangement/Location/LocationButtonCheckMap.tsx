import { buttonStyleEdge } from "@/styles/style";
import React from "react";
import { MdOutlineTipsAndUpdates } from "react-icons/md";

type TLocationButtonCheckMap = {
  states: TStates;
  locationId: string;
};

type TStates = {
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
};

function LocationButtonCheckMap({
  locationId,
  states,
}: TLocationButtonCheckMap) {
  const { selectedLocation, setSelectedLocation } = states;

  return (
    <button
      className={`${buttonStyleEdge} active:bg-slate-500 ${
        selectedLocation === locationId && "bg-[#86B6F6]"
      }`}
      onClick={() => {
        if (selectedLocation === locationId) {
          setSelectedLocation("");
        } else {
          setSelectedLocation(locationId);
        }
      }}
    >
      {selectedLocation === locationId ? (
        <MdOutlineTipsAndUpdates className="w-[4.8em]" />
      ) : (
        "Check Map"
      )}
    </button>
  );
}

export default LocationButtonCheckMap;
