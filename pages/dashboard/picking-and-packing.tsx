import React, { ReactElement } from "react";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";

export default function PickingAndPacking() {
  return (
    <div className="flex h-screen w-full flex-col gap-2 p-4 hover:overflow-y-auto">
      Pick and pack is a term for warehouse work that involves picking the
      correct type and number of items from shelves and packing them efficiently
      for shipping.
    </div>
  );
}

PickingAndPacking.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
