import useProductReport from "@/hooks/useFetchProductReport";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import Link from "next/link";
import React, { useState } from "react";
import MyDocument from "../MyDocument";
import OrderReport from "../Report/OrderDocument";

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
  /* 
    Need polling checker continuesly to product the product a replenishement report and date
    can only be seen in the report if the products threshold has been change
    THOUGHT PROCESS:
      - Create key value mapping
      - Only display the report if one users triggers it
  
    */

  console.log(JSON.stringify(product, null, 2));
  return <div className=""></div>;
}

export default Reports;
