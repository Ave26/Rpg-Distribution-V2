import { locations } from "@prisma/client";
import React from "react";
import { TOmitLocation } from "./locationTypes";

type TLocationDetails = {
  location: TOmitLocation;
};

function LocationDetails({ location }: TLocationDetails) {
  return (
    <>
      <h1 className="flex  items-center justify-center gap-2 text-center">
        <h1 className="select-none">Latitude:</h1>
        {location.coordinates.latitude}
      </h1>
      <h1 className="flex  items-center justify-center gap-2 text-center">
        <h1 className="select-none">Longitude:</h1>
        {location.coordinates.longitude}
      </h1>
      <h1 className="flex items-center justify-center gap-2 text-center">
        <h1 className="select-none">Name:</h1>
        {location.name}
      </h1>
    </>
  );
}

export default LocationDetails;
