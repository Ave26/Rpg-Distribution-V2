// pages/api/generateReport.js
import { NextApiRequest, NextApiResponse } from "next";
import { renderToStream } from "@react-pdf/renderer";
import prisma from "@/lib/prisma";

import { authMiddleware } from "../../authMiddleware";
import { BinDocument, TBinPage } from "@/features/manage-inventory";

export default authMiddleware(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const page = req.query as TBinPage;

    console.log(page);

    const binPage = Object.fromEntries(
      Object.entries(page).filter(([_, value]) => value !== "default") // Keep only non-empty values
    );

    console.log(binPage);

    try {
      const [bins, _] = await prisma.$transaction([
        prisma.bins.findMany({
          where: {
            ...binPage,
            assignedProducts: {
              some: {
                status: { in: ["Default", "Queuing"] },
                damageBinsId: { isSet: false },
                quality: "Good",
              },
            },
          },
          orderBy: [
            { category: "asc" },
            { rackName: "asc" },
            { row: "asc" },
            { shelfLevel: "asc" },
          ],
          select: {
            id: true,
            category: true,
            row: true,
            shelfLevel: true,
            rackName: true,
            _count: {
              select: {
                assignedProducts: {
                  where: {
                    status: { in: ["Default", "Queuing"] },
                    damageBinsId: { isSet: false },
                    quality: "Good",
                  },
                },
              },
            },
            assignedProducts: {
              where: {
                status: { in: ["Default", "Queuing"] },
                damageBinsId: { isSet: false },
                quality: "Good",
              },
              select: {
                skuCode: true,
                dateInfo: true,
                products: { select: { productName: true } },
              },
              take: 1,
            },
          },
        }),
        prisma.binLogReport.create({
          data: {
            category: page.category,
            rackName: page.rackName,
            timeStamp: new Date().toISOString(),
          },
        }),
      ]);
      const pdfStream = await renderToStream(<BinDocument bins={bins} />);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=bins_report${new Date()}.pdf`
      );

      return pdfStream.pipe(res);
    } catch (error) {
      return res.json(error);
    }
  }
);
