import prisma from ".";
import { TScanDataFinal } from "@/pages/api/inbound/scan";
import {
  BoxSize,
  Category,
  ProductQuality,
  bins,
  productStatus,
} from "@prisma/client";

function setMethod(category: string | null | undefined): "FIFO" | "FEFO" {
  const categoryToMethodMap: { [key: string]: "FIFO" | "FEFO" } = {
    Food: "FEFO",
    Cosmetics: "FEFO",
    Laundry: "FIFO",
    Sanitary: "FIFO",
    Cleaning: "FIFO",
  };

  return categoryToMethodMap[category as string];
}
export async function scanBarcode(
  assignedProduct: TScanDataFinal,
  userId: string
) {
  const { category, quantity, date: dt, threshold, ...rest } = assignedProduct;

  const date = `${dt.toLocaleString().split("T")[0]}T00:00:00.000+00:00`; // convert date into mongo db iso
  console.log(date);

  const models: Record<ProductQuality, any> = {
    Damage: await prisma.damageBins.findMany({
      where: {
        category: "ForReturnToSupplier",
        isAvailable: true,
      },
    }),
    Good: await prisma.bins.findMany({
      where: {
        racks: { categories: { category } },
        isAvailable: true,
      },
    }),
    Default: "",
  };

  const bins = models[rest.quality];

  let binIdPocket: string | undefined;

  const method = setMethod(category);

  const dateField = {
    FEFO: "expirationDate",
    FIFO: "dateReceived",
  };
  const field = dateField[method];
  console.log(field);

  if (rest.quality === "Damage") {
    console.log("inserted in Damage Bin");
    // insert it into damage bin

    // const damageBins = await prisma.damageBins.findMany({
    //   where: { category: "ForReturnToSupplier" },
    // });

    for (const bin of bins) {
      const b = await prisma.damageBins.findUnique({
        where: { id: bin.id },
        include: { _count: { select: { assignedProducts: true } } },
      });

      const hasSameProduct = await prisma.damageBins // kaparehas
        .findUnique({
          where: {
            id: bin.id,
            assignedProducts: {
              every: {
                barcodeId: rest.barcodeId,
                skuCode: rest.skuCode,
                [field]: date,
              },
            },
          },
        })
        .catch((e) => console.log(e));

      console.log(hasSameProduct);

      if (!b) {
        return;
      }
      if (b?.capacity > b?._count.assignedProducts) {
        if (bin.isAvailable && hasSameProduct) {
          const product = await prisma.assignedProducts.create({
            data: {
              ...rest,
              binId: bin.id,
              expirationDate: date,
              dateReceived: date,
            },
          });
          console.log(product);
          return;
          break;
        } else {
          continue;
        }
      } else {
        await prisma.damageBins.update({
          where: {
            id: bin.id,
          },
          data: {
            isAvailable: false,
          },
        });
      }
    }

    return {
      message: "inserted into damage bin and it is for return to supplier",
    };
  } else {
    for (const bin of bins) {
      // this bin doesn break for now
      // binIdPocket = bin.id;

      const b = await prisma.bins
        .findUnique({
          where: {
            id: bin.id,
            isAvailable: true,
            racks: { categories: { category } },
          },
          include: { _count: { select: { assignedProducts: true } } },
        })
        .catch((e) => console.log(e));

      const hasSameProduct = await prisma.bins // kaparehas
        .findUnique({
          where: {
            id: bin.id,
            assignedProducts: {
              every: {
                barcodeId: rest.barcodeId,
                skuCode: rest.skuCode,
                [field]: date,
              },
            },
          },
        })
        .catch((e) => console.log(e));
      console.log(hasSameProduct);

      if (!b) {
        return console.log("Bin is missing");
      }

      if (bin.capacity > b?._count.assignedProducts) {
        // insert some product
        if (bin.isAvailable && hasSameProduct) {
          // check if the product is the same and the product is still available
          const product = await prisma.assignedProducts.create({
            data: {
              ...rest,
              binId: bin.id,
              expirationDate: date,
              dateReceived: date,
            },
          });
          console.log(product);
          break;
        } else {
          // continue to another bin
          continue;
        }
      } else {
        await prisma.bins.update({
          where: {
            id: bin.id,
          },
          data: {
            isAvailable: false,
          },
        });
      }
    }
  }

  const count = await prisma.assignedProducts.count({
    where: { binId: binIdPocket },
  });

  return { message: `Product Count: ${count}` };
}

export async function getProductInfo(barcode: string) {
  const productInfo = await prisma.products.findFirstOrThrow({
    where: { barcodeId: barcode },
    select: {
      image: true,
      sku: { select: { code: true, threshold: true } },
      barcodeId: true,
      category: true,
    },
  });
  console.log(productInfo.sku);
  return { productInfo };
}
