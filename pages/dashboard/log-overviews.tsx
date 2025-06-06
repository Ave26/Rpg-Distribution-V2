// import { ReactElement, SetStateAction, useEffect, useState } from "react";
// import PickingAndPacking from "./picking-and-packing";
// import Layout from "@/components/layout";
// import DashboardLayout from "@/components/Admin/dashboardLayout";
// import { setTime } from "@/helper/_helper";
// import DeliveryLogs from "@/components/LogsOverview/DeliveryLogs";
// import OrderQueue from "@/components/LogsOverview/OrderQueue";
// import Reports from "@/components/LogsOverview/Reports";
// import GenerateReport from "../api/generateReport";
// import MyDocument from "@/components/MyDocument";
// import Link from "next/link";
// import { PDFViewer } from "@react-pdf/renderer";
// import LeafletMap from "@/components/ReusableComponent/Map/LeafletMap";
// import dynamic from "next/dynamic";
// import useDeliveryLogs from "@/hooks/useDeliveryLogs";
// import Map from "@/components/ReusableComponent/Map";
// import BinDocument from "@/components/Report/Inventory/BinDocument";
// import useBinLogReport from "@/hooks/useBinLogReport";
// import useUserScanned from "@/hooks/useUserScanned";
// import { RiUser4Fill } from "react-icons/ri";
// import { buttonStyleDark } from "@/styles/style";
// import { FaUserPlus } from "react-icons/fa";
// import { SiLg } from "react-icons/si";
// import { MdFiberManualRecord, MdFiberSmartRecord } from "react-icons/md";

// export default function LogOverviews() {
//   const [position, setPosition] = useState<[number, number]>([0, 0]);
//   const [truckName, setTruckName] = useState<string>("");
//   // h-full w-full bg-slate-300
//   // grid max-h-[90.8%] auto-cols-fr auto-rows-fr grid-cols-1 gap-2 bg-slate-300 p-2 sm:h-[88.5%] sm:grid-cols-2 lg:h-[87.5%]
//   const trucks = Array.from({ length: 4 }, (_, i) => {
//     return i + 1;
//   });
//   const logs = Array.from({ length: 4 }, (_, i) => {
//     return i + 1;
//   });

//   const [damagedProducts, setDamagedProducts] = useState(0);
//   const [goodProducts, setGoodProducts] = useState(310);
//   const [damagePercent, setDamagePercent] = useState(0);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setDamagedProducts((prev) => prev + 100);
//     }, 500); // Delay for demonstration
//     return () => clearTimeout(timeout);
//   }, []);

//   useEffect(() => {
//     if (goodProducts > 0) {
//       const percent = (damagedProducts / goodProducts) * 100;
//       setDamagePercent(percent);
//     }
//   }, [damagedProducts, goodProducts]);

//   const radius = 45;
//   const circumference = 2 * Math.PI * radius;
//   const dashOffset = circumference - (damagePercent / 100) * circumference;

//   return (
//     <section className={``}>
//       {/* <div className="col-span-2 flex flex-col overflow-x-hidden overflow-y-scroll rounded-md rounded-br-md bg-white shadow-md">
//         <OrderQueue />
//       </div> */}

//       <div className="relative h-32 w-32">
//         <svg className="-rotate-90 transform" viewBox="0 0 100 100">
//           <defs>
//             <linearGradient
//               id="damageGradient"
//               x1="0%"
//               y1="0%"
//               x2="0%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="rgb(250, 204, 21)" stopOpacity="1" />
//               <stop
//                 offset="50%"
//                 stopColor="rgb(251, 146, 60)"
//                 stopOpacity="1"
//               />
//               <stop
//                 offset="100%"
//                 stopColor="rgb(234, 88, 12)"
//                 stopOpacity="0.2"
//               />
//             </linearGradient>
//           </defs>

//           <circle
//             className="text-gray-300"
//             strokeWidth="10"
//             stroke="currentColor"
//             fill="transparent"
//             r={radius}
//             cx="50"
//             cy="50"
//           />
//           <circle
//             strokeWidth="10"
//             strokeDasharray={circumference}
//             strokeDashoffset={dashOffset}
//             strokeLinecap="round"
//             stroke="url(#damageGradient)"
//             fill="transparent"
//             r={radius}
//             cx="50"
//             cy="50"
//             style={{
//               transition: "stroke-dashoffset 1s ease-out",
//             }}
//           />
//         </svg>
//       </div>

//       {/* <div className="row-span-2 grid auto-rows-fr grid-cols-2 grid-rows-2 gap-1">

//         <div className="col-span-2 flex flex-col overflow-x-hidden overflow-y-scroll rounded-md rounded-l-md bg-white p-2 shadow-md">
//           <BinLogReports />
//         </div>
//         <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md rounded-l-md bg-white shadow-md">
//           <Reports />
//         </div>
//         <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md  bg-white shadow-md">
//           <UserProductScanned />
//         </div>
//       </div>
//       <div className="grid h-full max-h-full w-full grid-cols-2 gap-1  rounded-md rounded-bl-md bg-slate-200 p-1">
//         <DeliveryLogs states={{ position, setPosition, setTruckName }} />
//       </div>
//       <div className="flex flex-col rounded-md rounded-tl-md bg-white p-2 shadow-md">
//         <Map coordinates={position} truckName={truckName} />
//       </div> */}

//       {/* <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-md">
//         <OrderQueue />
//       </div>
//       <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-md">
//         <Reports />
//       </div>
//       <div className="flex w-full flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-md">
//         <DeliveryLogs states={{ position, setPosition, setTruckName }} />
//       </div>
//       <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white p-2 shadow-md">
//         <BinLogReports />
//       </div>
//       <div className="flex flex-col rounded-md bg-white p-2 shadow-md">
//         <Map coordinates={position} truckName={truckName} />
//       </div>
//       <div className="flex flex-col overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-md">
//         <UserProductScanned />
//       </div> */}
//     </section>
//   );
// }

// LogOverviews.getLayout = (page: ReactElement) => {
//   return (
//     <Layout>
//       <DashboardLayout>{page}</DashboardLayout>
//     </Layout>
//   );
// };

// function BinLogReports() {
//   const { error, binReport, isLoading } = useBinLogReport();

//   return (
//     <>
//       <h1 className="font-black uppercase">BIN LOG REPORT</h1>
//       {Array.isArray(binReport) &&
//         binReport
//           .map((bin) => {
//             return (
//               <a
//                 key={bin.id}
//                 href={`/api/logs/generate/bin-report?category=${bin.category}&rackName=${bin.rackName}`}
//                 className="flex w-fit flex-col gap-2 hover:text-blue-800"
//               >
//                 {bin.category}-{bin.rackName}-{bin.timeStamp.toString()}
//               </a>
//             );
//           })
//           .reverse()}
//     </>
//   );
// }

// function UserProductScanned() {
//   const { userScanned, error, isLoading } = useUserScanned();

//   return (
//     <div className="flex flex-col justify-start gap-2 bg-slate-700 p-2">
//       {Array.isArray(userScanned) &&
//         userScanned.map((u) => {
//           return (
//             <ul
//               key={u.username}
//               className="h-fit gap-2 rounded-md bg-white p-2 uppercase shadow-sm hover:bg-sky-300"
//             >
//               <li>User: {u.username}</li>
//               <li>Duplicate Count: {u.count}</li>
//               <li>Current Date: {u.count}</li>
//             </ul>
//           );
//         })}
//     </div>
//   );
// }

// /*
//   beofre set the truck status to be delivered, check first the products inside if all of those are delivered
//   every product that has been delivered has a logs records so the it can be track the info later

//   IMPLEMENT:
//   DEPLOYED VERSION OF GEOLOCATION TO BE ENABLED √
//   OUTOBUND DAMAGE PRODUCT | REPORT  -- DONWLODABLE
//   INVENTORY DAMAGE PRODUCT | REPORT -- DOWNLODABLE
//   REPLENISHMENT AND SORTING
//     - POLLING THE PRODUCT TO BE REPLENISH

//   REPORT TEMPLATE
//   PRODUCT, TOTAL QUANTITY SCANNED, POO, DATE
//   DOWNLOADABLE DESGINED PDF

//   ADDED TODO:
//   CREATE LINK TO DISPLAY MAP
//   THE FILL METHOD NEEDS A SIZE IN IMAGE && CHANGE THE PATH IN TO URL
// */

import React from "react";

function LogOverviews() {
  return <div>log-overviews</div>;
}

export default LogOverviews;
