import React, { ReactElement, useState, useEffect } from "react";
import useSWR from "swr";
import jsPDF from "jspdf";
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
import { getTrucks } from "@/lib/prisma/trucks";
import { useMyContext } from "@/contexts/AuthenticationContext";

import { trucks as TTrucks, UserRole } from "@prisma/client";
import AdminUI from "@/components/PickingAndPackingRole/AdminUI";
import StaffUI from "@/components/PickingAndPackingRole/StaffUI";
import useMapComponent from "@/hooks/useMapComponent";

export default function PickingAndPacking({ trucks }: { trucks: TTrucks[] }) {
  const roleComponentMapper = {
    SuperAdmin: () => <AdminUI trucks={trucks || null} />,
    Admin: () => <AdminUI trucks={trucks} />,
    Staff: () => <StaffUI />,
    Driver: () => undefined,
  };

  const { MappedComponent } = useMapComponent(roleComponentMapper);

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>
      <div>{MappedComponent}</div>
    </>
  );
}

export async function getServerSideProps() {
  const { trucks } = await getTrucks();

  if (!trucks) {
    return {
      props: {
        trucks: null,
      },
    };
  }

  return {
    props: { trucks },
  };
}

PickingAndPacking.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
