// this is intended to keep track where the product will be placed in automatic Mode
import React, { useState } from "react";

interface ViewRacksProps {
  isOpenRack: boolean;
  racks?: ShelfLevel[];
}

interface ShelfLevel {
  id: string;
  level: number;
  capacity: boolean;
  racksId: string;
  bin: Bin[];
}

interface Bin {
  id: string;
  isAvailable: boolean;
  binSection: null;
  capacity: number;
  racksId: null;
  shelfLevelId: string;
}

function ViewRacks({ isOpenRack, racks }: ViewRacksProps): JSX.Element {
  const [rackName, setRackName] = useState<string>("Rack Name");
  const [style, setStyle] = useState("");

  return (
    <div className="flex h-full w-60 flex-col items-center justify-center border">
      {racks
        ?.map((value, index) => {
          return (
            <div
              key={value?.id}
              className="grid h-full w-full grid-flow-col gap-2 border">
              {value.bin.map((v, i) => {
                return (
                  <div key={value?.id} className="h-full w-full border">
                    {value?.level}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setRackName(v.id);
                        console.log(v?.id);
                      }}
                      key={v.id}
                      className="h-full w-full cursor-pointer rounded-md border border-black text-center hover:bg-cyan-500/30">
                      {`A${i + 1}-${index + 1}`}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })
        .reverse()}
    </div>
  );
}

export default ViewRacks;
