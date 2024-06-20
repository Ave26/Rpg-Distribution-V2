import Link from "next/link";
import React from "react";

type TReport = {
  product: string;
  totalQuantityScanned: number;
  POO: string;
  date: Date;
};

function Reports() {
  const date = new Date().toLocaleDateString();
  /* 
    Need polling checker continuesly to product the product a replenishement report and date
  */

  return (
    <div className="flex gap-2">
      <h3>Inventory Summary Report</h3>
      <Link href="/api/generateReport" download className="text-sky-600">
        Product Report
      </Link>
      <h3>Date: {date}</h3>
    </div>
  );
}

export default Reports;
