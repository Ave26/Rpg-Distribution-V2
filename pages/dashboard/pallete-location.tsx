import React, { ReactElement, useEffect, useState } from "react";
import Layout from "@/components/layout";
import ReusableButton from "@/components/Parts/ReusableButton";

import CreateRack from "@/components/CreateRack";
import UpdateRack from "@/components/UpdateRack";

export default function PalleteLocation({ data: dta }: any) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Layout data={dta}>
      <section className="h-full w-full font-bold">
        <div className="flex flex-row items-center justify-center gap-2 p-3">
          <ReusableButton name={"Create Rack"} onClick={() => setOpen(false)} />
          <ReusableButton name={"Update Rack"} onClick={() => setOpen(true)} />
        </div>
        {!open ? <CreateRack /> : <UpdateRack />}
      </section>
    </Layout>
  );
}
