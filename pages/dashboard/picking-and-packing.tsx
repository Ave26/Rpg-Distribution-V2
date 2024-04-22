import React, { ReactElement, useState, useEffect } from "react";
import useSWR from "swr";
import Head from "next/head";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import BinsLayout from "@/components/BinsLayout";
import Loading from "@/components/Parts/Loading";
import Search from "@/components/Parts/Search";
import ReusableButton from "@/components/Parts/ReusableButton";

import { EntriesTypes } from "@/types/binEntries";
import { Bin } from "@/types/inventory";
import { TFormData } from "@/types/inputTypes";
import { Orders } from "@/types/ordersTypes";
import { useMyContext } from "@/contexts/AuthenticationContext";

import { trucks as TTrucks, UserRole } from "@prisma/client";
import Admin from "@/components/PickingAndPackingRole/AdminUI";
import StaffUI from "@/components/PickingAndPackingRole/StaffUI/Staff";
import useMapComponent from "@/hooks/useMapComponent";
import useTrucks from "@/hooks/useTrucks";
import AdminUI from "@/components/PickingAndPackingRole/AdminUI/Admin";
// { trucks }: { trucks: TTrucks[] }

export default function PickingAndPacking() {
  const roleComponentMapper = {
    SuperAdmin: () => <Admin />,
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
