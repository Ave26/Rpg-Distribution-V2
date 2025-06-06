import { NextApiRequest, NextApiResponse } from "next";
import { renderToStream } from "@react-pdf/renderer";
import { generateBarcodePNG } from "@/helper/generateBarcodePNG";
import prisma from "@/lib/prisma";
import { BinBarcodes, TBinPage } from "@/features/manage-inventory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = req.query as TBinPage;

  const binPage = Object.fromEntries(
    Object.entries(page).filter(([_, value]) => value !== "default") // Keep only non-empty values
  );

  console.log(binPage);

  const barcodes = await prisma.bins
    .findMany({
      orderBy: [
        { category: "asc" },
        { rackName: "asc" },
        { row: "asc" },
        { shelfLevel: "asc" },
      ],
      where: { ...binPage },

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
  const pdfStream = await renderToStream(<BinBarcodes barcodes={barcodes} />);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=bin_barcode-${new Date()}.pdf`
  );

  return pdfStream.pipe(res);
}
