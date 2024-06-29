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
import Link from "next/link";
import { PDFViewer } from "@react-pdf/renderer";

export default function LogOverview() {
  return (
    <section className="grid h-full grid-cols-1 gap-2 md:grid-cols-2">
      {/* <Logs />
        
      <OrderQueue />
      <DeliveryLogs /> */}
      <div className="relative col-span-1 flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-md transition-all">
        <h1 className="abosolute uppercase">Order Queue</h1>
        <OrderQueue />
        <Link
          href={"/api/logs/generate/orderReport"}
          className="absolute bottom-2 right-2"
        >
          Generate Order
        </Link>
      </div>
      <div className="row-span-2 flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-md transition-all">
        <Reports />

        {/* <Test /> */}
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

/* 
  beofre set the truck status to be delivered, check first the products inside if all of those are delivered
  every product that has been delivered has a logs records so the it can be track the info later

  IMPLEMENT: 
  DEPLOYED VERSION OF GEOLOCATION TO BE ENABLED √
  OUTOBUND DAMAGE PRODUCT | REPORT  -- DONWLODABLE 
  INVENTORY DAMAGE PRODUCT | REPORT -- DOWNLODABLE
  REPLENISHMENT AND SORTING
    - POLLING THE PRODUCT TO BE REPLENISH

  REPORT TEMPLATE
  PRODUCT, TOTAL QUANTITY SCANNED, POO, DATE
  DOWNLOADABLE DESGINED PDF


  ADDED TODO: 
  CREATE LINK TO DISPLAY MAP
  THE FILL METHOD NEEDS A SIZE IN IMAGE && CHANGE THE PATH IN TO URL
*/
