import { ReactElement, useEffect, useState } from "react";
import PickingAndPacking from "./picking-and-packing";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { setTime } from "@/helper/_helper";

export default function LogOverview() {
  return (
    <section className="relative h-screen w-full">
      <div className="h-1/2 w-1/2">Log Reports</div>
      <div className="h-1/2 w-1/2">Delivery Logs</div>
    </section>
  );
}

LogOverview.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
