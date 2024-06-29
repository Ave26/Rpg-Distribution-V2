// pages/api/generateReport.js
import { NextApiRequest, NextApiResponse } from "next";
import { renderToStream } from "@react-pdf/renderer";
import prisma from "@/lib/prisma";

import OrderReports from "@/components/Report/OrdersDocument";

export type TReportData = {
  product: string;
  totalQuantityScanned: number;
  POO: string;
  date: Date;
};

// export default authMiddleware(
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const getRecords = await prisma.records.findMany({
    where: {
      dateCreated: { gte: firstDayOfMonth, lte: lastDayOfMonth },
    },
    select: {
      id: true,
      clientName: true,
      dateCreated: true,
      POO: true,
      _count: { select: { orderedProductsTest: true } },
      orderedProductsTest: {
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
  const pdfStream = await renderToStream(<OrderReports records={getRecords} />);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=Order_Report.pdf`);

  return pdfStream.pipe(res);
};
// );
