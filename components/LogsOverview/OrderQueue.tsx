import useRecords from "@/hooks/useRecords";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import MyDocument from "../MyDocument";
import Link from "next/link";

function OrderQueue() {
  const { error, isLoading, records } = useRecords();
  const titles = [
    "Order Id",
    "Customer Name",
    "Order Date",
    "Total Items",
    "Total Quantity",
    "Total Amount",
  ];

  return (
    <table className="overflow-y-scroll">
      <thead>
        <tr>
          {titles.map((title, index) => (
            <th
              key={index}
              className="border border-black border-y-transparent"
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(records) &&
          records.map((record) => (
            <tr key={record.id} className="text-center text-[10px] font-bold">
              <td>{record.id}</td>
              <td>{record.clientName}</td>
              <td>{record.dateCreated?.toLocaleString()}</td>
              <td>{record._count.orderedProductsTest}</td>
              <td>
                {record.orderedProductsTest.reduce((acc, initial) => {
                  return (
                    acc +
                    initial.binLocations.reduce((acc, initial) => {
                      return acc + initial.quantity;
                    }, 0)
                  );
                }, 0)}
              </td>
              <td className="flex justify-between gap-2">
                ₱
                {record.orderedProductsTest
                  .reduce((acc, initial) => {
                    return (
                      acc +
                      initial.binLocations.reduce((acc, initial) => {
                        const totalPrice =
                          initial.stockKeepingUnit?.products.price *
                          initial.quantity;
                        return acc + totalPrice;
                      }, 0)
                    );
                  }, 0)
                  .toLocaleString()}
                {/* <Link
                  href={`/api/logs/generate/orderReport?id=${record.id}`}
                  className="text-sky-500 underline"
                >
                  Downlod File
                </Link> */}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default OrderQueue;

// import useRecords from "@/hooks/useRecords";
// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import Link from "next/link";
// import React from "react";
// import MyDocument from "../MyDocument";
// import OrderReport from "../Report/OrderDocument";

// function OrderQueue() {
//   const { error, isLoading, records } = useRecords();
//   const titles = [
//     "Order Id",
//     "Customer Name",
//     "Order Date",
//     "Total Items",
//     "Total Quantity",
//     "Total Amount",
//   ];

//   return (
//     <table className="overflow-y-scroll">
//       <thead>
//         <tr>
//           {titles.map((title, index) => {
//             return (
//               <th className="border border-black border-y-transparent">
//                 {title}
//               </th>
//             );
//           })}
//         </tr>
//       </thead>
//       <tbody>
//         {Array.isArray(records) &&
//           records.map((record) => {
//             <MyDocument record={record} />;
//             return (
//               <tr key={record.id} className="text-center text-[10px] font-bold">
//                 <td>{record.id}</td>
//                 <td>{record.clientName}</td>
//                 <td>{String(record.dateCreated)}</td>
//                 <td>{record._count.orderedProductsTest}</td>
//                 <td>
//                   {record.orderedProductsTest.reduce((acc, initial) => {
//                     return (
//                       acc +
//                       initial.binLocations.reduce((acc, initial) => {
//                         return acc + initial.quantity;
//                       }, 0)
//                     );
//                   }, 0)}
//                 </td>
//                 <td className="flex justify-between gap-2">
//                   ₱
//                   {record.orderedProductsTest
//                     .reduce((acc, initial) => {
//                       return (
//                         acc +
//                         initial.binLocations.reduce((acc, initial) => {
//                           const totalPrice =
//                             initial.stockKeepingUnit?.products.price *
//                             initial.quantity;
//                           return acc + totalPrice;
//                         }, 0)
//                       );
//                     }, 0)
//                     .toLocaleString()}
//                   <PDFDownloadLink
//                     document={<MyDocument record={record} />}
//                     fileName="order_report.pdf"
//                   >
//                     {({ blob, url, loading, error }) =>
//                       loading ? "Loading document..." : "Download now!"
//                     }
//                   </PDFDownloadLink>
//                 </td>
//               </tr>
//             );
//           })}
//       </tbody>
//     </table>
//   );
// }

// export default OrderQueue;
