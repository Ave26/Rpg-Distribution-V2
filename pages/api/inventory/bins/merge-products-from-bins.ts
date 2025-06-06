import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../../authMiddleware";
import prisma from "@/lib/prisma";
import { InventoryPage, isCategoryParams } from ".";
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

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const section: InventoryPage = req.body;
  const { category, rackName } = section;
  let newCategoryPage: InventoryPage | {} = {};

  // paginate
  if (isCategoryParams(section)) {
    newCategoryPage = Object.fromEntries(
      Object.entries(section).filter(([_, value]) => value !== "default")
    );
  }

  try {
    const bins = await prisma.bins.findMany({
      where: newCategoryPage,
      include: {
        _count: {
          select: {
            assignedProducts: {
              where: {
                binLocationsId: { isSet: false },
                status: "Default",
                quality: "Good",
              },
            },
          },
        },
        assignedProducts: {
          where: {
            binLocationsId: { isSet: false },
            status: "Default",
            quality: "Good",
          },
          select: {
            id: true,
            binId: true,
            dateInfo: true,
            skuCode: true,
            barcodeId: true,
            purchaseOrder: true,
          },
        },
      },
      take: 15,
    });

    const { sortedBinMap } = createBinMap(bins);

    const updates: Prisma.PrismaPromise<Prisma.BatchPayload>[] = [];
    const emptyBins: EmptyBins[] = [];

    for (const [index, bin] of bins.entries()) {
      if (bin._count.assignedProducts === 0) continue; // Skip empty bins

      console.log(bin._count.assignedProducts, bin.id);

      const skuCode = bin.assignedProducts[0]?.skuCode;
      const dateInfo = bin.assignedProducts[0]?.dateInfo;
      const key = `${skuCode}_${dateInfo.date.toISOString()}_${dateInfo.type}`;

      let binsFromBinMap = sortedBinMap.get(key) || [];
      binsFromBinMap = binsFromBinMap.filter(
        (v) => v.count > 0 && v.id !== bin.id
      ); // Only process non-empty bins and not same product

      for (const targetBin of binsFromBinMap) {
        if (bin.id === targetBin.id) continue; // Skip self-processing
        console.log(targetBin.id);

        const newCapacity = bin.capacity - bin._count.assignedProducts; // 10 - 3 = 7
        const transferable = Math.min(
          newCapacity,
          targetBin.assignedProducts.length
        );

        const limitedProductIds = targetBin.assignedProducts
          .slice(0, transferable)
          .map((v) => v.id);

        const update = prisma.assignedProducts.updateMany({
          where: {
            binId: targetBin.id,
            id: { in: limitedProductIds },
          },
          data: { binId: bin.id },
        });
        updates.push(update);

        if (transferable > 0) {
          // Update counts for the current and target bins

          bin._count.assignedProducts += transferable; // update bin count

          targetBin.count -= transferable; // binMap count
          targetBin.assignedProducts = targetBin.assignedProducts.filter(
            (product) => !limitedProductIds.includes(product.id)
          );

          console.log(index, limitedProductIds);
          // I also need to push take the po

          bins[targetBin.binIndex]._count.assignedProducts -= transferable;
          if (bin._count.assignedProducts === 0) {
            bins[targetBin.binIndex].assignedProducts = [];
          }
          // If the current bin becomes empty, stop processing further
          if (
            bin._count.assignedProducts === 0 ||
            bin._count.assignedProducts === bin.capacity
          )
            break;
        }
      }

      // Update the sortedBinMap for the next iteration
      sortedBinMap.set(
        key,
        binsFromBinMap.filter((v) => v.count > 0) // Only keep non-empty bins
      );
    }

    // Output the final state of bins
    // console.log(
    //   bins
    //     .filter((v) => v._count.assignedProducts !== 0)
    //     .map((v) => ({ binId: v.id, count: v._count.assignedProducts }))
    // );
    console.log(sortedBinMap);
    await prisma.$transaction(updates);

    return res.status(200).json("Bins organized successfully.");
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);

function createBinMap(bins: Bins[]) {
  // accumulate the bins in one go
  const binMap: Map<string, BinMap[]> = new Map();
  bins.forEach((bin: Bins, binIndex) => {
    if (bin._count.assignedProducts > 0) {
      const { dateInfo, skuCode } = bin.assignedProducts[0];
      const key = `${skuCode}_${dateInfo.date.toISOString()}_${dateInfo.type}`;
      if (!binMap.has(key)) {
        binMap.set(key, []);
      }

      const { id, _count } = bin;

      const count = _count.assignedProducts;
      if (bin._count.assignedProducts < bin.capacity) {
        binMap.get(key)?.push({
          id,
          count,
          // assignedProducts: bin.assignedProducts.map((v) => { }),
          assignedProducts: bin.assignedProducts.map((v) => ({
            id: v.id,
            PO: v.purchaseOrder,
          })),
          binIndex,
        });
      }
    }
  });

  const sortedEntries = Array.from(binMap.entries()).sort(([keyA], [keyB]) => {
    const dateA = new Date(keyA.split("_")[1]);
    const dateB = new Date(keyB.split("_")[1]);
    return dateA.getDate() - dateB.getDate();
  });

  const sortedBinMap = new Map(sortedEntries);

  console.log(sortedBinMap);
  return { sortedBinMap };
}
