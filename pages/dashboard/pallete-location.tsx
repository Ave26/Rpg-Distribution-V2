import React, { ReactElement, useEffect, useState } from "react";
import Layout from "@/components/layout";
import ReusableButton from "@/components/Parts/ReusableButton";

import CreateRack from "@/components/CreateRack";
import UpdateRack from "@/components/UpdateRack";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { buttonStyleEdge, buttonStyleSubmit } from "@/styles/style";
import DamageBin from "@/components/PalleteLocation/DamageBin";
import Bin from "@/components/PalleteLocation/Bin";

type BinType = "Bin" | "Damage Bin";

export default function PalleteLocation() {
  const [binType, setBinType] = useState<BinType>("Bin");
  return (
    <>
      <section className="flex h-full w-full flex-col gap-2 rounded-md bg-white p-2 font-bold">
        <div className="grid h-fit w-full grid-flow-col gap-2">
          <SelectionView setBinType={setBinType} binType={binType} />
        </div>
        <PalleteView binType={binType} />
      </section>
    </>
  );
}

interface PalleteViewProps {
  binType: BinType;
}

function PalleteView({ binType }: PalleteViewProps) {
  const binSelection = {
    Bin: <Bin />,
    "Damage Bin": <DamageBin />,
  };
  const materialize = binSelection[binType];

  return <>{materialize}</>;
}

interface SelectionViewProps {
  binType: BinType;
  setBinType: React.Dispatch<React.SetStateAction<BinType>>;
}

function SelectionView({ setBinType, binType }: SelectionViewProps) {
  const buttonSelections: BinType[] = ["Bin", "Damage Bin"];
  return (
    <>
      {buttonSelections.map((name) => {
        return (
          <button
            key={name}
            onClick={() => {
              setBinType(name);
            }}
            className={`${buttonStyleEdge} ${
              name === binType && "bg-slate-600 text-white"
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
