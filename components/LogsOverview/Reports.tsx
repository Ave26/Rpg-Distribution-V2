import useProductReport from "@/hooks/useFetchProductReport";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import Link from "next/link";
import React, { useState } from "react";
import MyDocument from "../MyDocument";
import OrderReport from "../Report/OrderDocument";
import useProductLogStatus from "@/hooks/useProductLogStatus";

type TReport = {
  product: string;
  totalQuantityScanned: number;
  POO: string;
  date: Date;
};

type TReportType = "productReplenishment" | "others";

function Reports() {
  const date = new Date().toLocaleDateString();
  const { product, error, isLoading } = useProductReport();
  const { status } = useProductLogStatus();
  /* 
    Need polling checker continuesly to product the product a replenishement report and date
    can only be seen in the r eport if the products threshold has been change
    THOUGHT PROCESS:
      - Create key value mapping
      - Only display the report if one users triggers it
  
    */

  return (
    <div className="flex flex-col p-2">
      <h1 className="font-black uppercase">Product Status Report</h1>
      <div className="flex w-full flex-col rounded-md">
        {Array.isArray(status) &&
          status.map((s) => {
            let message;
            if (s.status === "HEALTHY") {
              message = `The product is Healthy with ${s.assignedProductCount} items, which is above the threshold of ${s.threshold}. No action needed.`;
            } else if (s.status === "MODERATE") {
              message = `The product ${s.skuCode} is Moderate with ${s.assignedProductCount} items, below the threshold of ${s.threshold}. Consider replenishing soon.`;
            } else if (s.status === "CRITICAL") {
              message = `The product ${s.skuCode} is Critical with only ${s.assignedProductCount} items left, far below the threshold of ${s.threshold}. Replenishment is urgent.`;
            }

            return (
              <div key={s.id} className="flex p-2">
                <h2>{message}</h2>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Reports;
