import React from "react";
import { TBinLocation, TBinLocations } from "./Admin";

type ViewBinLocationsProps = { binLocations: TBinLocations[] };

function ViewBinLocations({ binLocations }: ViewBinLocationsProps) {
  return (
    <div>
      {Array.isArray(binLocations) ? (
        binLocations.map((binLocation) => {
          return (
            <div
              key={binLocation.binId}
              className="flex flex-col items-center justify-center gap-2 border border-black p-2 text-xs transition-all md:flex-row"
            >
              <h1>{binLocation.quantity}</h1>
              <h1>{binLocation.skuCode}</h1>
            </div>
          );
        })
      ) : (
        <>currently dont have record</>
      )}
    </div>
  );
}

export default ViewBinLocations;
