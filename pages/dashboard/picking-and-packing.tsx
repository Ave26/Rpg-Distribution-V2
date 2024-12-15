import React, { ReactElement } from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import Admin from "@/components/PickingAndPackingRole/AdminUI";
import StaffUI from "@/components/PickingAndPackingRole/StaffUI/Staff";
import useMapComponent from "@/hooks/useMapComponent";
import AdminUI from "@/components/PickingAndPackingRole/AdminUI/Admin";
// { trucks }: { trucks: TTrucks[] }

export default function PickingAndPacking() {
  const roleComponentMapper = {
    SuperAdmin: () => <AdminUI />, //Admin
    Admin: () => <AdminUI />,
    Staff: () => <StaffUI />,
    Driver: () => undefined,
  };

  const { MappedComponent } = useMapComponent(roleComponentMapper);

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>
      <section className="h-full w-full">{MappedComponent}</section>
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
