import { ReactElement, SetStateAction, useEffect, useState } from "react";
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
import LeafletMap from "@/components/ReusableComponent/Map/LeafletMap";
import dynamic from "next/dynamic";
import useDeliveryLogs from "@/hooks/useDeliveryLogs";
import Map from "@/components/ReusableComponent/Map";
import BinDocument from "@/components/Report/Inventory/BinDocument";
import useBinLogReport from "@/hooks/useBinLogReport";
import useUserScanned from "@/hooks/useUserScanned";

export default function LogOverview() {
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [truckName, setTruckName] = useState<string>("");

  return (
    <section className="grid h-full grid-cols-1 gap-2 md:grid-cols-2">
      <div className="relative col-span-1 flex h-full flex-col gap-2 overflow-x-scroll rounded-md border border-slate-200 bg-white p-2 shadow-md transition-all">
        <h1 className="abosolute uppercase">Order Queue</h1>
        <OrderQueue />
        <a
          href={"/api/logs/generate/orderReports"}
          className="absolute right-2 top-2 uppercase text-sky-500 underline"
        >
          Generate Orders For This Month
        </a>
      </div>
      <div className="row-span-2 flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-md transition-all">
        <Reports />
        <BinLogReports />
        <UserProductScanned />
      </div>
      <div className="relative col-span-1  flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-md transition-all">
        <h1 className="abosolute uppercase">Delivery Logs</h1>
        <DeliveryLogs states={{ position, setPosition, setTruckName }} />
        <div className="relative">
          <Map coordinates={position} truckName={truckName} />
        </div>
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

function BinLogReports() {
  const { error, binReport, isLoading } = useBinLogReport();

  return (
    <div className="flex flex-col gap-2 border border-black p-2">
      <h1 className="font-black uppercase">BIN LOG REPORT</h1>
      {Array.isArray(binReport) &&
        binReport
          .map((bin) => {
            return (
              <a
                key={bin.id}
                href={`/api/logs/generate/bin-report?category=${bin.category}&rackName=${bin.rackName}`}
                className="flex w-fit flex-col gap-2  hover:text-blue-800"
              >
                {bin.category}-{bin.rackName}-{bin.timeStamp.toString()}
              </a>
            );
          })
          .reverse()}
    </div>
  );
}

function UserProductScanned() {
  const { userScanned, error, isLoading } = useUserScanned();

  return (
    <div className="flex flex-col justify-start gap-2 bg-slate-700 p-2 ">
      {Array.isArray(userScanned) &&
        userScanned.map((u) => {
          return (
            <ul
              key={u.username}
              className="h-fit gap-2 rounded-md bg-white p-2 uppercase shadow-sm hover:bg-sky-300"
            >
              <li>User: {u.username}</li>
              <li>Duplicate Count: {u.count}</li>
              <li>Current Date: {u.count}</li>
            </ul>
          );
        })}
    </div>
  );
}

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
