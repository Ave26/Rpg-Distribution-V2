import { buttonStyleEdge } from "@/styles/style";
import React, { SetStateAction } from "react";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { mutate } from "swr";

type TLocationButtonUpdate = {
  states: TStates;
  locationId: string;
};

type TStates = {
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
};

function LocationButtonUpdate({ states, locationId }: TLocationButtonUpdate) {
  const { selectedLocation, setSelectedLocation } = states;

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    fetch("/api/location/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    })
      .then((res) => res.json())
      .then((data) => data && mutate("/api/location/find"))
      .catch((error) => console.log(error));
  }

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

export default LocationButtonUpdate;
