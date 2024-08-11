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
    <table className="">
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
              <td>{record._count.orderedProducts}</td>
              <td>
                {record.orderedProducts.reduce((acc, initial) => {
                  return (
                    acc +
                    initial.binLocations.reduce((acc, initial) => {
                      return acc + initial.quantity;
                    }, 0)
                  );
                }, 0)}
              </td>
              <td className="flex gap-2">
                ₱
                {record.orderedProducts
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
                <Link
                  href={`/api/logs/generate/orderReport?id=${record.id}`}
                  className="flex-shrink-0 text-sky-500 underline"
                >
                  Downlod File
                </Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default OrderQueue;
