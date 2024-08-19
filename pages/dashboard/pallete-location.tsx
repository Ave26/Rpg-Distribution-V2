import React, { ReactElement, useEffect, useState } from "react";
import Layout from "@/components/layout";
import ReusableButton from "@/components/Parts/ReusableButton";

import CreateRack from "@/components/CreateRack";
import UpdateRack from "@/components/UpdateRack";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { buttonStyleEdge, buttonStyleSubmit } from "@/styles/style";
import DamageBin from "@/components/PalleteLocation/DamageBin";

export default function PalleteLocation() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDamageBin, setOpenDamageBin] = useState<boolean>(true);

  function handleClick() {
    setOpenDamageBin(!openDamageBin);
  }

  return (
    <>
      <section className="h-full w-full rounded-md bg-white p-2 font-bold">
        <div className="flex flex-row items-center justify-center gap-2 p-3">
          {/* <ReusableButton name={"Create Rack"} onClick={() => setOpen(false)} />
          <ReusableButton name={"Update Rack"} onClick={() => setOpen(true)} /> */}
          <button
            onClick={handleClick}
            type="button"
            className={`${buttonStyleEdge} hover:bg-sky-300 active:bg-sky-500`}
          >
            Create Damage Bin
          </button>
        </div>
        {openDamageBin ? <DamageBin /> : null}

        {!open ? <CreateRack /> : <UpdateRack />}
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
