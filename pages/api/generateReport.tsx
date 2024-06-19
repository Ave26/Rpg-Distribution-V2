// pages/api/generateReport.js
import { NextApiRequest, NextApiResponse } from "next";
import { renderToStream } from "@react-pdf/renderer";
import MyDocument from "@/components/MyDocument";

export type TReportData = {
  product: string;
  totalQuantityScanned: number;
  POO: string;
  date: Date;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reportData: TReportData = {
    product: "Sample Product",
    totalQuantityScanned: 100,
    POO: "Origin Place",
    date: new Date(),
  };

  const pdfStream = await renderToStream(
    <MyDocument reportData={reportData} />
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=productReport.pdf"
  );

  pdfStream.pipe(res);
};
