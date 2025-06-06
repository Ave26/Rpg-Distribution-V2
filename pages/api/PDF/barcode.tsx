// /pages/api/barcode-pdf.ts
import { NextApiRequest, NextApiResponse } from "next";
import { renderToStream } from "@react-pdf/renderer";
import { generateBarcodePNG } from "@/helper/generateBarcodePNG";
import { BarcodePDF } from "@/components/PDF/BarcodePDF";
import prisma from "@/lib/prisma";
import { InventoryBins, InventoryPage } from "../inventory/bins";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const code = req.body;
  // console.log(code);

  const inventoryPage = req.query as unknown as InventoryPage;
  let newCategoryPage: InventoryPage | Partial<Prisma.binLogReportCreateInput> =
    {};

  console.log(inventoryPage);

  newCategoryPage = Object.fromEntries(
    Object.entries(inventoryPage).filter(([_, value]) => value !== "default") // Keep only non-empty values
  );

  console.log(newCategoryPage);

  const barcodes = await prisma.bins
    .findMany({
      orderBy: [
        { category: "asc" },
        { rackName: "asc" },
        { row: "asc" },
        { shelfLevel: "asc" },
      ],
      where: newCategoryPage,

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
    })
    .then(async (bins) => {
      return await Promise.all(
        bins.map(async (bin) => {
          const barcode = `${bin.category}${bin.rackName}-${bin.row}/${bin.shelfLevel}`;
          const base64 = await generateBarcodePNG(barcode);
          return { label: barcode, base64 };
        })
      );
    })
    .catch((e) => console.log(e));

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=barcode-${Math.random()}.pdf`
  );

  const pdfStream = await renderToStream(<BarcodePDF barcodes={barcodes} />);
  return pdfStream.pipe(res);
}
