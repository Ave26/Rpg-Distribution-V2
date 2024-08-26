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
interface ViewProps {
  materialize: BinType;
}
interface SelectViewProps {
  setMaterialize: React.Dispatch<React.SetStateAction<BinType>>;
}

function View({ materialize }: ViewProps) {
  const binSelection = {
    Bin: <Bin />,
    "Damage Bin": <DamageBin />,
  };
  const displayView = binSelection[materialize];
  return <>{displayView}</>;
}

function SelectView({ setMaterialize }: SelectViewProps) {
  return (
    <>
      <button
        className={`${buttonStyleEdge}`}
        onClick={() => setMaterialize("Bin")}
      >
        Bin
      </button>
      <button
        className={`${buttonStyleEdge}`}
        onClick={() => setMaterialize("Damage Bin")}
      >
        Damage Bin
      </button>
    </>
  );
}

export default function PalleteLocation() {
  const [materialize, setMaterialize] = useState<BinType>("Bin");

  return (
    <>
      <section className="flex h-full w-full flex-col gap-2 rounded-md bg-white p-2 font-bold">
        <div className="grid h-fit w-full grid-flow-col gap-2">
          <SelectView setMaterialize={setMaterialize} />
        </div>
        <View materialize={materialize} />

        {/* <div className="flex flex-row items-center justify-center gap-2 border border-black p-3">
          <ReusableButton name={"Create Rack"} onClick={() => setOpen(false)} />
          <ReusableButton name={"Update Rack"} onClick={() => setOpen(true)} />
          <button
            onClick={handleClick}
            type="button"
            className={`${buttonStyleEdge} hover:bg-sky-300 active:bg-sky-500`}
          >
            Create Damage Bin
          </button>
          <button className={`${buttonStyleEdge} bg-red-600`}>
            Add Damage Category
          </button>
        </div>
        {openDamageBin ? <DamageBin /> : null}
        {!open ? <CreateRack /> : <UpdateRack />} */}
      </section>
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
