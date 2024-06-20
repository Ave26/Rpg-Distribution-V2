// pages/api/generateReport.js
import { NextApiRequest, NextApiResponse } from "next";
import { renderToStream } from "@react-pdf/renderer";
import MyDocument from "@/components/MyDocument";
import prisma from "@/lib/prisma";
import { authMiddleware } from "./authMiddleware";

export type TReportData = {
  product: string;
  totalQuantityScanned: number;
  POO: string;
  date: Date;
};

// export default authMiddleware(
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reportData: TReportData = {
    product: "Sample Product",
    totalQuantityScanned: 100,
    POO: "Origin Place",
    date: new Date(),
  };

  const product = await prisma.assignedProducts.findMany({
    where: { status: "Delivered" },
    select: { skuCode: true },
  });

  const pdfStream = await renderToStream(
    <MyDocument reportData={reportData} product={product} />
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=productReport.pdf"
  );

  pdfStream.pipe(res);
};
// );
