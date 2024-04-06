import Loading from "@/components/Parts/Loading";
import useLocations from "@/hooks/useLocations";
import {
  buttonStyle,
  buttonStyleEdge,
  buttonStyleSubmit,
} from "@/styles/style";
import React, { useEffect, useState } from "react";
import LocationButtonUpdate from "./LocationButtonUpdate";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import LocationFormUpdate from "./LocationFormUpdate";
import LocationDetails from "./LocationDetails";
import LocationButtonCheckMap from "./LocationButtonCheckMap";

export default function ViewLocations() {
  const { locations } = useLocations();
  const [selectedLocation, setSelectedLocation] = useState("");

  // useEffect(() => {
  //   console.log(selectedLocation);
  // }, [selectedLocation]);

  return (
    <>
      {Array.isArray(locations) ? (
        locations?.map((location) => (
          <div key={location.id} className="flex w-full gap-2">
            <div className="flex h-full w-full flex-col items-center gap-2 rounded-md bg-gray-500/20 p-2 text-center">
              <div className="flex h-fit w-full flex-wrap gap-2 bg-slate-500/5 p-2 shadow-sm">
                <LocationDetails location={location} />
              </div>

              <LocationFormUpdate
                locationId={location.id}
                states={{
                  selectedLocation,
                }}
              />
            </div>
            <LocationButtonCheckMap
              locationId={location.id}
              states={{
                selectedLocation,
                setSelectedLocation,
              }}
            />
          </div>
        ))
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Loading />
        </div>
      )}
    </>
  );
}
