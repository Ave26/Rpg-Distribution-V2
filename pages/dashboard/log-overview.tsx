import { ReactElement, useEffect, useState } from "react";
import PickingAndPacking from "./picking-and-packing";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { setTime } from "@/helper/_helper";
import DeliveryLogs from "@/components/LogsOverview/DeliveryLogs";
import OrderQueue from "@/components/LogsOverview/OrderQueue";
import Reports from "@/components/LogsOverview/Reports";
import GenerateReport from "../api/generateReport";
import MyDocument from "@/components/MyDocument";

export default function LogOverview() {
  return (
    <section className="grid h-full grid-cols-1 gap-2 md:grid-cols-2">
      {/* <Logs />

      <OrderQueue />
      <DeliveryLogs /> */}
      <div className="col-span-1 flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-md transition-all">
        <h1 className="abosolute uppercase">Order Queue</h1>
        <OrderQueue />
      </div>
      <div className="row-span-2 flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-md transition-all">
        <Reports />
      </div>
      <div className="relative col-span-1 flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-md transition-all">
        <h1 className="abosolute uppercase">Delivery Logs</h1>
        <DeliveryLogs />
      </div>
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
