import Loading from "@/components/Parts/Loading";
import useTrucks from "@/hooks/useTrucks";
import React, { useState } from "react";
import RecordSelection from "../PickingAndPackingRole/StaffUI/RecordSelection";
import { trucks } from "@prisma/client";
import RecordsView from "../PickingAndPackingRole/StaffUI/RecordsView";

type TTruckSelectionProps = {
  states: TStates;
};

type TStates = {
  selectedId: string[];
  setSelectedId: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TruckSelection({ states }: TTruckSelectionProps) {
  const { selectedId, setSelectedId } = states;
  const { trucks } = useTrucks();

  return (
    <>
      {Array.isArray(trucks) ? (
        trucks?.map((truck) => {
          return (
            <>
              <div
                key={truck.id}
                className="flex h-10 w-full items-center justify-between rounded-sm border border-black p-2"
                onClick={() => {
                  if (selectedId?.includes(truck.id)) {
                    setSelectedId(selectedId.filter((i) => i !== truck.id));
                  } else {
                    setSelectedId([...selectedId, truck.id]);
                  }
                }}
              >
                <h1>Truck Name: {truck.truckName}</h1>
                <h1>Payload Capacity: {truck.payloadCapacity}</h1>
                <h1>({truck.records.length})</h1>
              </div>
              <RecordsView selectedId={selectedId} truck={truck} />
            </>
          );
        })
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-black">
          <Loading />
        </div>
      )}
    </>
  );
}
