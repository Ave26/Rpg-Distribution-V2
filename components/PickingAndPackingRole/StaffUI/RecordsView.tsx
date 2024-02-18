import React from "react";
import { TTrucks } from "../PickingAndPackingType";
import RecordSelection from "./RecordSelection";
import { useMyContext } from "@/contexts/AuthenticationContext";

type TRecordsViewProps = {
  truck: TTrucks;
  selectedId: string[];
};

function RecordsView({ truck, selectedId }: TRecordsViewProps) {
  return (
    <div
      className={`mb-2 flex ${
        selectedId.find((i) => i === truck.id)
          ? "h-[45em] overflow-y-scroll py-2"
          : "max-h-0 overflow-hidden"
      } w-full flex-col items-center justify-start gap-[2px] rounded-sm border border-transparent transition-all`}
    >
      {Array.isArray(truck.records) ? (
        truck.records.map((record) => (
          <div
            key={record.id}
            className="flex w-full flex-col gap-2 border border-black p-2"
          >
            <RecordSelection record={record} />
          </div>
        ))
      ) : (
        <>no data</>
      )}
    </div>
  );
}

export default RecordsView;
