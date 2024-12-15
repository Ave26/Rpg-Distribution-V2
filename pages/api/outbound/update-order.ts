import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import { product_status_log, SupplyLevelStatus } from "@prisma/client";
import { TUpdateTrucks } from "@/components/PickingAndPackingRole/StaffUI/LoadRecordButton";
import prisma from "@/lib/prisma";
import { timeStamp } from "console";

export type ProductStatusLog = Omit<product_status_log, "id">;

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const {
    assignedProductIds: ids,
    total,
    status,
    truckId,
  }: TUpdateTrucks = req.body;

  const truck = await prisma.trucks.findUnique({
    where: { id: truckId },
  });

  prisma
    .$transaction(async (prisma) => {
      console.log("initialize");

      const updateTruck = await prisma.trucks.update({
        where: { id: truckId, version: truck?.version },
        data: {
          status,
          payloadCapacity: { decrement: total },
          version: { increment: 1 },
        },
        select: { truckName: true },
      });
      const updateProduct = await prisma.assignedProducts
        .updateMany({
          where: { id: { in: ids } },
          data: { status: "Loaded", truckName: updateTruck.truckName },
        })
        .catch((e) => console.log(e));

      console.log(updateProduct);
      const { logResult } = await getProductStatusReport(ids);
      console.log(logResult);

      await prisma.product_status_log.createMany({
        data: logResult,
      });

      return updateProduct
        ? res.status(200).json({
            message: "Transaction completed successfully.",
          })
        : res.status(500).json({
            message: "Server Error",
          });
    })
    .catch((e) => console.log(e));
}

export default authMiddleware(handler);

type comparisonResults = ({
  skuCode: string;
  assignedProductCount: number;
  threshold: number;
  exceedsThreshold: boolean;
} | null)[];

async function getProductStatusReport(ids: string[]) {
  const skuCodes = await prisma.assignedProducts
    .findMany({
      where: { id: { in: ids } },
      select: { skuCode: true },
      distinct: "skuCode",
    })
    .then((ap) => ap.map((v) => v.skuCode));
  // this count will determine the status of the sku
  const productSKUCount = await prisma.assignedProducts
    .groupBy({
      by: ["skuCode"], // Group by SKU code
      where: { status: "Default" },
      having: { skuCode: { in: skuCodes } },
      _count: { id: true },
    })
    .then((ap) => ap.map((v) => ({ count: v._count.id, skuCode: v.skuCode })));

  // take the code and threshold
  const sku = await prisma.stockKeepingUnit.findMany({
    where: { code: { in: skuCodes } },
    select: { threshold: true, code: true },
  });

  // I need skuCode along with the threshold
  const logResult = skuCodes.reduce((acc: ProductStatusLog[], skuCode) => {
    // return data | undefined
    const product = productSKUCount.find((psc) => psc.skuCode === skuCode);
    const skuInfo = sku.find((v) => v.code === skuCode);

    if (!skuInfo) return acc;
    const { threshold } = skuInfo;
    const count = product ? product.count : 0;
    const percentage = (count / threshold) * 100;

    acc.push({
      skuCode,
      assignedProductCount: product ? product.count : 0,
      timeStamp: new Date(),
      exceedsThreshold: false,
      threshold,
      status: setProductStatus(percentage),
      percentage,
    });

    return acc;
  }, []);
  console.log(logResult);
  console.log(productSKUCount);

  return { logResult };
}

function setProductStatus(percentage: number) {
  let status: SupplyLevelStatus;
  if (percentage >= 75) {
    status = "HEALTHY";
  } else if (percentage >= 50 && percentage < 75) {
    status = "MODERATE";
  } else {
    status = "CRITICAL";
  }
  return status;
}
