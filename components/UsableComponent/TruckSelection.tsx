import Loading from "@/components/Parts/Loading";
import useTrucks from "@/hooks/useTrucks";
import React, { useState } from "react";
import RecordSelection from "../PickingAndPackingRole/StaffUI/RecordSelection";
import { trucks } from "@prisma/client";
import RecordsView from "../PickingAndPackingRole/StaffUI/RecordsView";
import UpdateTruckStatus from "../PickingAndPackingRole/StaffUI/UpdateTruckStatus";
import { useMyContext } from "@/contexts/AuthenticationContext";
import EmergencyStopButton from "../PickingAndPackingRole/StaffUI/EmergencyStopButton";
import GasStopButton from "../PickingAndPackingRole/StaffUI/GasStopButton";

type TTruckSelectionProps = {
  states: TStates;
};

type TStates = {
  selectedId: string[];
  setSelectedId: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TruckSelection({ states }: TTruckSelectionProps) {
  const { globalState } = useMyContext();
  const role: string | undefined = globalState?.verifiedToken?.roles;
  const { selectedId, setSelectedId } = states;
  const { trucks } = useTrucks();

  return (
    <>
      {Array.isArray(trucks) ? (
        trucks?.map((truck) => {
          return (
            <div key={truck.id}>
              <div
                className="flex h-fit w-full flex-col items-center justify-between rounded-sm border border-black p-1 transition-all md:flex-row"
                onClick={() => {
                  selectedId?.includes(truck.id)
                    ? setSelectedId(selectedId.filter((i) => i !== truck.id))
                    : setSelectedId([...selectedId, truck.id]);
                }}
              >
                <h1>Truck Name: {truck.truckName}</h1>
                <h1>Payload Capacity: {truck.payloadCapacity}</h1>
                <h1>Status: {truck.status}</h1>
                {role === "Driver" && (
                  <div className="gap-2transition-all flex w-[30em] items-center justify-end gap-2">
                    <GasStopButton />
                    <EmergencyStopButton />
                    <UpdateTruckStatus key={truck.id} truck={truck} />
                  </div>
                )}
                ({truck.records.length})
              </div>
              <RecordsView selectedId={selectedId} truck={truck} />
            </div>
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
