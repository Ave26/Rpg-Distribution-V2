import { trucks } from "@prisma/client";
import React from "react";

type TruckDetailsProps = {
  truck: trucks;
};

function TruckDetails(truckDetails: TruckDetailsProps) {
  const { truck } = truckDetails;
  return (
    <>
      <h1>Truck Name: {truck.truckName}</h1>
      <h1>Threshold: {truck.threshold}</h1>
      <h1>Payload Capacity: {truck.payloadCapacity}</h1>
      <h1>Status: {truck.status}</h1>
    </>
  );
}

export default TruckDetails;
