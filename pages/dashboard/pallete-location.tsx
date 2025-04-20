import React, { ReactElement, useContext, useEffect, useState } from "react";
import Layout from "@/components/layout";
import ReusableButton from "@/components/Parts/ReusableButton";

import CreateRack from "@/components/CreateRack";
import UpdateRack from "@/components/UpdateRack";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { buttonStyleEdge, buttonStyleSubmit } from "@/styles/style";
import DamageBin from "@/components/PalleteLocation/DamageBin";
import Bin from "@/components/PalleteLocation/Bin";
import { useMyContext } from "@/contexts/AuthenticationContext";

type BinType = "Bin" | "Damage Bin";

export default function PalleteLocation() {
  const { states } = useMyContext();
  // const [binType, setBinType] = useState<BinType>("Bin");

  //  setBinType={setBinType} binType={binType}
  return (
    <section className="flex h-full w-full flex-col gap-2 rounded-md p-2">
      {/* <div className="grid h-fit w-full grid-flow-col gap-2">
        <SelectionView />
      </div> */}
      <PalleteView binType={states?.binType} />
    </section>
  );
}

interface PalleteViewProps {
  binType?: BinType;
}

function PalleteView({ binType }: PalleteViewProps) {
  const binSelection = {
    Bin: <Bin />,
    "Damage Bin": <DamageBin />,
  };
  const materialize = binSelection[binType ?? "Bin"];

  return <div className="flex h-full w-full gap-2">{materialize}</div>;
}

// interface SelectionViewProps {
//   binType: BinType;
//   setBinType: React.Dispatch<React.SetStateAction<BinType>>;
// { setBinType, binType }: SelectionViewProps
// }

export type BinTypes = ["Bin", "Damage Bin"];

function SelectionView() {
  // const buttonSelections: BinType[] = ["Bin", "Damage Bin"];
  const { states } = useMyContext();

  const buttonSelections: BinTypes = ["Bin", "Damage Bin"];

  return (
    <>
      {buttonSelections.map((name) => {
        return (
          <button
            key={name}
            onClick={() => {
              states?.setBinType(name);
            }}
            className={`${buttonStyleEdge} ${
              name === states?.binType && "bg-slate-600 text-white"
            } `}
          >
            {name}
          </button>
        );
      })}
    </>
  );
}

PalleteLocation.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
