import React, { ReactElement } from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import Admin from "@/components/PickingAndPackingRole/AdminUI";
import StaffUI from "@/components/PickingAndPackingRole/StaffUI/Staff";
import useMapComponent from "@/hooks/useMapComponent";
import AdminUI from "@/components/PickingAndPackingRole/AdminUI/Admin";
import { FaBoxesPacking } from "react-icons/fa6";
// { trucks }: { trucks: TTrucks[] }

export default function PickingAndPacking() {
  const roleComponentMapper = {
    SUPERADMIN: () => <AdminUI />, //Admin
    ADMIN: () => <AdminUI />,
    STAFF: () => <StaffUI />,
    DRIVER: () => undefined,
  };

  const { MappedComponent } = useMapComponent(roleComponentMapper);

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>
      <section className="flex h-full w-full flex-col rounded-b-none rounded-t-md bg-slate-300 font-black lg:overflow-hidden">
        <div className="flex h-[8%] w-full justify-between rounded-t-md bg-white p-2">
          <FaBoxesPacking
            size={30}
            className="flex h-full animate-emerge  items-center justify-center"
          />
        </div>

        {MappedComponent}
      </section>
    </>
  );
}

PickingAndPacking.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
