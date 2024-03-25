import React from "react";
import { TTrucks } from "../PickingAndPackingType";
import RecordSelection from "../../ReusableComponent/RecordSelection";

type TRecordsViewProps = {
  truck: TTrucks;
  selectedId: string[];
};

export default function RecordsView({ truck, selectedId }: TRecordsViewProps) {
  return (
    <div
      className={`mb-2 flex ${
        selectedId.find((i) => i === truck.id)
          ? "h-fit overflow-y-scroll border border-dotted border-x-slate-900 border-y-transparent py-2"
          : "max-h-0 overflow-hidden"
      } w-full flex-col items-center justify-center gap-[2px] rounded-sm border border-transparent transition-all`}
    >
      {Array.isArray(truck.records) ? (
        truck.records.map((record) => (
          <div
            key={record.id}
            className="flex w-full flex-col gap-2 border border-black border-x-transparent p-2"
          >
            <RecordSelection data={{ record, truck }} />
          </div>
        ))
      ) : (
        <>no data</>
      )}
    </div>
  );
}
