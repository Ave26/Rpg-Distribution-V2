import prisma from ".";
import { convertTime } from "@/helper/_helper";
import { TAssignedProducts } from "@/pages/api/inbound/scan";
import { BoxSize, ProductQuality, bins, productStatus } from "@prisma/client";

type TExtendsAssignedProduct = {
  dateReceive: Date;
  expirationDate: string;
  binId: string;
  usersId: string;
  status: productStatus;
  barcodeId: string;
  purchaseOrder: string;
  boxSize: BoxSize;
  quality: ProductQuality;
  skuCode: string;
};

async function findCategory(barcodeId: string) {
  const productPromise = prisma.products.findUnique({
    where: {
      barcodeId,
    },
    select: {
      category: true,
    },
  });

  const categoryPromise = prisma.categories.findFirst({
    where: {
      category: (await productPromise)?.category,
    },
    select: {
      id: true,
      category: true,
    },
  });

  const binsPromise = prisma.bins.findMany({
    where: {
      racks: { categoriesId: (await categoryPromise)?.id },
      isAvailable: true,
    },
    include: {
      racks: {
        select: {
          categories: {
            select: {
              category: true,
            },
          },
        },
      },
      _count: {
        select: {
          assignedProducts: { where: { status: "Default" || "Queuing" } },
        },
      },
      assignedProducts: { select: { id: true } },
    },
  });
  const [product, categories, bins] = await prisma.$transaction([
    productPromise,
    categoryPromise,
    binsPromise,
  ]);
  return { product, categories, bins };
}

function createNewData(
  assignedProduct: TAssignedProducts,
  binId: string,
  usersId: string
) {
  const { expirationDate } = assignedProduct;
  const { DateExpiry, DateReceive } = convertTime(expirationDate);
  console.log(expirationDate);
  const newData = {
    ...assignedProduct,
    dateReceive: DateReceive,
    expirationDate: DateExpiry,
    binId,
    usersId,
  };

  return { newData };
}

function setMethod(
  category: string | null | undefined
): "FIFO" | "FEFO" | null {
  const categoryToMethodMap: { [key: string]: "FIFO" | "FEFO" } = {
    Food: "FEFO",
    Cosmetics: "FEFO",
    Laundry: "FIFO",
    Sanitary: "FIFO",
    Cleaning: "FIFO",
  };

  return categoryToMethodMap[category as string] ?? null;
}

export async function scanBarcode(
  assignedProduct: TAssignedProducts,
  userId: string
) {
  const { barcodeId, quality } = assignedProduct;
  const { bins } = await findCategory(barcodeId);
  let binIdPocket: string | undefined;
  if (quality === "Damage") {
    console.log("inserted in Damage Bin");
  } else {
    for (const bin of bins) {
      binIdPocket = bin.id;
      const method = setMethod(bin.racks?.categories?.category);
      const { newData } = createNewData(assignedProduct, bin.id, userId);

      const updatedAssignedProductCount = await prisma.assignedProducts.count({
        where: {
          binId: bin.id,
          quality: "Good",
          status: "Default" || "Queuing",
        },
      });

      const dateField = method === "FIFO" ? "dateReceive" : "expirationDate";
      const isTheSameProduct = await prisma.bins.findFirst({
        where: {
          id: bin.id,
          isAvailable: true,
          assignedProducts: {
            every: {
              barcodeId: {
                equals: assignedProduct.barcodeId,
              },
              skuCode: {
                equals: assignedProduct.skuCode,
              },
              [dateField]: {
                equals:
                  method === "FIFO"
                    ? newData.dateReceive
                    : newData.expirationDate,
              },
            },
          },
        },
      });

      if (bin.capacity > updatedAssignedProductCount) {
        console.log(`inserting product on ${bin.id}`);
        if (isTheSameProduct || updatedAssignedProductCount === 0) {
          // if product is null || isSame  and capacity not exceed break otherwise dont break and iterate over
          await prisma.assignedProducts.create({
            data: newData,
          });
          console.log("product created");
          break;
        }
      } else {
        // update bin availability - go to next bin iteration
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

export async function scanMultipleProduct(
  assignedProduct: TAssignedProducts,
  quantity: number,
  userId: string
) {
  const { barcodeId, quality } = assignedProduct;
  const { bins } = await findCategory(barcodeId);
  let binIdPocket: string | undefined;
  if (quality === "Damage") {
    console.log("inserted in Damage Bin");
  } else {
    for (const bin of bins) {
      binIdPocket = bin.id;
      const { newData } = createNewData(assignedProduct, bin.id, userId);
      const method = setMethod(bin.racks?.categories?.category);
      // quantity = 2
      // iterate the request based on quantity
      // dont break the loop when inserting multiple
      // need to see the updated count
      // check if the capacity exceeded
      // only break the loop when the last iteration of bin is gone
      let threshold = quantity;
      for (const bin of bins) {
        const assignedProductCount = await prisma.assignedProducts.count({
          where: {
            binId: bin.id,
            quality: "Good",
            status: "Default" || "Queuing",
          },
        });

        if (bin.capacity > assignedProductCount) {
          for (let i = 0; i < threshold; i++) {
            /* 
              use transaction to track the count and also if the count is < capcity then break and createMany

            */

            const count = await prisma.assignedProducts.count({
              where: {
                binId: bin.id,
                quality: "Good",
                status: "Default" || "Queuing",
              },
            });
            await prisma.assignedProducts.create({
              data: newData,
            });
            threshold -= 1;

            console.log(`Updated Count ${count}`);

            // for each requst the updated count should be seen
          }
          break;
        } else {
          console.log("updated available to false and iterate to next bin");
          await prisma.bins.update({
            where: {
              id: bin.id,
            },
            data: {
              isAvailable: false,
            },
          });
        }

        // binIdPocket = bin.id;
        // const method = setMethod(bin.racks?.categories?.category);
        // const { newData } = createNewData(assignedProduct, bin.id, userId);
        // const updatedAssignedProductCount = await prisma.assignedProducts.count(
        //   {
        //     where: {
        //       binId: bin.id,
        //       quality: "Good",
        //       status: "Default" || "Queuing",
        //     },
        //   }
        // );
        // const dateField = method === "FIFO" ? "dateReceive" : "expirationDate";
        // const isTheSameProduct = await prisma.bins.findFirst({
        //   where: {
        //     id: bin.id,
        //     isAvailable: true,
        //     assignedProducts: {
        //       every: {
        //         barcodeId: {
        //           equals: assignedProduct.barcodeId,
        //         },
        //         skuCode: {
        //           equals: assignedProduct.skuCode,
        //         },
        //         [dateField]: {
        //           equals:
        //             method === "FIFO"
        //               ? newData.dateReceive
        //               : newData.expirationDate,
        //         },
        //       },
        //     },
        //   },
        // });
        // if (bin.capacity > updatedAssignedProductCount) {
        //   console.log(`inserting product on ${bin.id}`);
        //   if (isTheSameProduct || updatedAssignedProductCount === 0) {
        //     await prisma.assignedProducts.create({
        //       data: newData,
        //     });
        //     console.log("product created");
        //     break;
        //   }
        // } else {
        //   // update bin availability - go to next bin iteration
        //   await prisma.bins.update({
        //     where: {
        //       id: bin.id,
        //     },
        //     data: {
        //       isAvailable: false,
        //     },
        //   });
        // }
      }
    }
  }
  const count = await prisma.assignedProducts.count({
    where: { binId: binIdPocket },
  });

  return { message: `Product Count: ${count}` };
}

async function isProductAlreadyAssigned(
  bin: bins,
  method: "FIFO" | "FEFO" | null,
  newData: TExtendsAssignedProduct
) {
  const updatedAssignedProductCountPromise = prisma.assignedProducts.count({
    where: {
      binId: bin.id,
      quality: "Good",
      status: "Default" || "Queuing",
    },
  });

  const dateField = method === "FIFO" ? "dateReceive" : "expirationDate";
  const isTheSameProductPromise = prisma.bins.findFirst({
    where: {
      id: bin.id,
      isAvailable: true,
      assignedProducts: {
        every: {
          barcodeId: {
            equals: newData.barcodeId,
          },
          skuCode: {
            equals: newData.skuCode,
          },
          [dateField]: {
            equals:
              method === "FIFO" ? newData.dateReceive : newData.expirationDate,
          },
        },
      },
    },
  });

  const [isTheSameProduct, updatedAssignedProductCount] =
    await prisma.$transaction([
      updatedAssignedProductCountPromise,
      isTheSameProductPromise,
    ]);

  // Return true if the product is already assigned, false otherwise
  return { isTheSameProduct, updatedAssignedProductCount };
}
