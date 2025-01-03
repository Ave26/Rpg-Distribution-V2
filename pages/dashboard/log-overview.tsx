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
import { RiUser4Fill } from "react-icons/ri";
import { buttonStyleDark } from "@/styles/style";
import { FaUserPlus } from "react-icons/fa";
import { SiLg } from "react-icons/si";
import { MdFiberManualRecord, MdFiberSmartRecord } from "react-icons/md";

export default function LogOverview() {
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [truckName, setTruckName] = useState<string>("");
  //relative col-span-1 flex h-[20em] flex-col gap-2 overflow-x-scroll rounded-md border border-slate-200 bg-white p-2 shadow-md transition-all
  //  h-full w-full grid-cols-1 gap-2 md:grid-cols-2
  return (
    <section
      className={`flex h-full w-full flex-col rounded-b-none rounded-t-md bg-slate-300 font-black`}
    >
      <div className="flex h-[8%] w-full justify-between rounded-t-md bg-white p-2">
        <MdFiberSmartRecord
          size={30}
          className="flex h-full animate-emerge  items-center justify-center"
        />
      </div>

      <div className="grid h-[49em] grid-cols-1 grid-rows-3 gap-2 p-2 lg:grid-cols-2">
        <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-md">
          <OrderQueue />
        </div>
        <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-md">
          <Reports />
        </div>
        <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-md">
          <DeliveryLogs states={{ position, setPosition, setTruckName }} />
        </div>
        <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-md">
          <BinLogReports />
        </div>
        <div className="relative flex flex-col rounded-md bg-white p-2 shadow-md">
          <Map coordinates={position} truckName={truckName} />
        </div>
        <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-md">
          <UserProductScanned />
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
    <>
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
    </>
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
