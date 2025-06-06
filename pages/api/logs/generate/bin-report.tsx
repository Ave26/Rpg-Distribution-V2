// pages/api/generateReport.js
import { NextApiRequest, NextApiResponse } from "next";
import { renderToStream } from "@react-pdf/renderer";
import prisma from "@/lib/prisma";

import { authMiddleware } from "../../authMiddleware";
import BinDocument from "@/components/Report/Inventory/BinDocument";
import { InventoryBins, InventoryPage } from "../../inventory/bins";
import { Prisma } from "@prisma/client";

export default authMiddleware(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const inventoryPage = req.query as unknown as InventoryPage;
    let newCategoryPage:
      | InventoryPage
      | Partial<Prisma.binLogReportCreateInput> = {};

    console.log(inventoryPage);

    newCategoryPage = Object.fromEntries(
      Object.entries(inventoryPage).filter(([_, value]) => value !== "default") // Keep only non-empty values
    );

    console.log(newCategoryPage);

    try {
      const bins = await prisma.bins
        .findMany({
          orderBy: [
            { category: "asc" },
            { rackName: "asc" },
            { row: "asc" },
            { shelfLevel: "asc" },
          ],
          where: {
            ...newCategoryPage,
            assignedProducts: {
              some: {
                status: { in: ["Default", "Queuing"] },
                damageBinsId: { isSet: false },
                quality: "Good",
              },
            },
          },

          select: {
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
            id: true,
            row: true,
            shelfLevel: true,
            category: true,
            rackName: true,

            assignedProducts: {
              where: {
                status: { in: ["Default", "Queuing"] },
                damageBinsId: { isSet: false },
                quality: "Good",
              },
              include: {
                sku: { select: { threshold: true } },
                products: { select: { productName: true } },
              },
              distinct: "purchaseOrder",
            },
          },
          take: 10,
        })
        .then((bins) => {
          // console.log(bins);
          return bins.map((bin): InventoryBins => {
            const {
              id: binId,
              _count,
              category,
              rackName,
              row,
              shelfLevel,
            } = bin;
            const test = rackName ? rackName : "";
            const count = _count.assignedProducts;

            if (count === 0) {
              return {
                bin: {
                  binId,
                  category,
                  count,
                  rackName: test,
                  row,
                  shelfLevel,
                },
                product: undefined, // or any other default value or structure you prefer
              };
            }

            const {
              barcodeId,
              dateInfo,
              id,
              products,
              quality,
              skuCode,
              status,
              sku,
            } = bin.assignedProducts[0];

            const productName = products.productName;
            const threshold = sku.threshold;
            const POs = bin.assignedProducts.map((ap) => ap.purchaseOrder);

            return {
              bin: { binId, category, count, rackName: test, row, shelfLevel },
              product: {
                barcodeId,
                dateInfo,
                id,
                POs,
                productName,
                quality,
                skuCode,
                status,
                threshold,
              },
            };
          });
        });

      const pdfStream = await renderToStream(<BinDocument inventory={bins} />);

      await prisma.binLogReport
        .create({
          data: {
            category: newCategoryPage.category ?? "", // Ensure default values
            rackName: newCategoryPage.rackName ?? "",
            timeStamp: new Date().toISOString(),
          },
        })
        .catch((e) => console.log(e));

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Order_Report_${"bins download"}.pdf`
      );

      return pdfStream.pipe(res);
    } catch (error) {
      return res.json(error);
    }
  }
);
