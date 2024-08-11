// pages/api/generateReport.js
import { NextApiRequest, NextApiResponse } from "next";
import { renderToStream } from "@react-pdf/renderer";
import prisma from "@/lib/prisma";
import MyDocument from "@/components/MyDocument";
import OrderReport from "@/components/Report/OrderDocument";
import { records } from "@prisma/client";
import { TRecords } from "@/fetcher/fetchRecord";
import { TRecord } from "@/components/PickingAndPackingRole/AdminUI/AdminRecordForm";

// export default authMiddleware(
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const record = req.query;
  const getRecord = await prisma.records.findFirst({
    where: { id: record.Id as string },
    select: {
      id: true,
      clientName: true,
      dateCreated: true,
      SO: true,
      _count: { select: { orderedProducts: true } },
      orderedProducts: {
        select: {
          binLocations: {
            select: {
              quantity: true,
              stockKeepingUnit: {
                select: { products: { select: { price: true } } },
              },
            },
          },
        },
      },
    },
  });
  const pdfStream = await renderToStream(<OrderReport record={getRecord} />);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Order_Report_${record.id}.pdf`
  );

  return pdfStream.pipe(res);
};
// );
