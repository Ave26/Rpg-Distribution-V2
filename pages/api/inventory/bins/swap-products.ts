import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { InventoryPage, isCategoryParams } from "./find";
import { assignedProducts as ap, bins, Prisma } from "@prisma/client"; // Ensure correct import

type OmitAssignedProducts = Pick<
  ap,
  "id" | "binId" | "dateInfo" | "skuCode" | "barcodeId" | "purchaseOrder"
>;

type Bins = bins & {
  _count: { assignedProducts: number };
  assignedProducts: OmitAssignedProducts[];
};

type BinMap = {
  id: string;
  count: number;
  assignedProducts: { id: string; PO: string }[];
  binIndex: number;
};

type EmptyBins = {
  binId: string;
  shelfLevel: number;
  row: number;
  index: number;
};

type Request = {
  page: { category: string; rackName: string };
  selectedBinIds: Record<string, string>;
};
export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const clientRequest: Request = req.body;

  const { page, selectedBinIds } = clientRequest;
  const updates: Prisma.PrismaPromise<Prisma.BatchPayload>[] = [];

  const BinIdKey = Object.keys(selectedBinIds)[0];
  const BinIdValue = Object.values(selectedBinIds)[0];

  console.log(BinIdKey, BinIdValue);

  // ifFound create otherwise update

  if (!BinIdKey || !BinIdValue) return res.json("Empty Address");

  const bin1 = await prisma.bins.findUnique({
    where: { id: BinIdKey },
    select: { assignedProducts: { select: { id: true } } },
  });

  const bin2 = await prisma.bins.findUnique({
    where: { id: BinIdValue },
    select: { assignedProducts: { select: { id: true } } },
  });

  const bin1Products = bin1?.assignedProducts.map((p) => p.id) || [];
  const bin2Products = bin2?.assignedProducts.map((p) => p.id) || [];

  await prisma
    .$transaction([
      // Update products currently in bin1 to point to bin2
      prisma.assignedProducts.updateMany({
        where: { binId: BinIdKey, id: { in: bin1Products } },
        data: { binId: BinIdValue },
      }),
      // Update products currently in bin2 to point to bin1
      prisma.assignedProducts.updateMany({
        where: { binId: BinIdValue, id: { in: bin2Products } },
        data: { binId: BinIdKey },
      }),
    ])
    .catch((e) => console.log(e));

  return res.json("Product Swap Succesfully");
}

export default authMiddleware(handler);

// function createBinMap(bins: Bins[]) {
//   // accumulate the bins in one go
//   const binMap: Map<string, BinMap[]> = new Map();
//   bins.forEach((bin: Bins, binIndex) => {
//     if (bin._count.assignedProducts > 0) {
//       const { dateInfo, skuCode } = bin.assignedProducts[0];
//       const key = `${skuCode}_${dateInfo.date.toISOString()}_${dateInfo.type}`;
//       if (!binMap.has(key)) {
//         binMap.set(key, []);
//       }

//       const { id, _count } = bin;

//       const count = _count.assignedProducts;
//       if (bin._count.assignedProducts < bin.capacity) {
//         binMap.get(key)?.push({
//           id,
//           count,
//           // assignedProducts: bin.assignedProducts.map((v) => { }),
//           assignedProducts: bin.assignedProducts.map((v) => ({
//             id: v.id,
//             PO: v.purchaseOrder,
//           })),
//           binIndex,
//         });
//       }
//     }
//   });

//   const sortedEntries = Array.from(binMap.entries()).sort(([keyA], [keyB]) => {
//     const dateA = new Date(keyA.split("_")[1]);
//     const dateB = new Date(keyB.split("_")[1]);
//     return dateA.getDate() - dateB.getDate();
//   });

//   const sortedBinMap = new Map(sortedEntries);

//   console.log(sortedBinMap);
//   return { sortedBinMap };
// }
