import { assignedProducts, bins, Category } from "@prisma/client";
import prisma from ".";

function setTime(value: Date | string | null) {
  let dateReceive = new Date();

  // Set the time component to zero
  dateReceive.setUTCHours(0);
  dateReceive.setUTCMinutes(0);
  dateReceive.setUTCSeconds(0);
  dateReceive.setUTCMilliseconds(0);

  // Format the date without time zone offset in local time
  dateReceive.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const expiry = `${value}T00:00:00.000Z`;

  return { dateReceive, expiry };
}

type TAssignedProducts = Omit<
  assignedProducts,
  | "id"
  | "dateReceive"
  | "binId"
  | "orderedProductsId"
  | "ordersId"
  | "truckName"
  | "productId"
  | "damageBinId"
  | "usersId"
>;

export async function scan_barcode(
  assignedProduct: TAssignedProducts,
  quantity: number,
  usersId: string
) {
  try {
    let scanData: object | null = null;
    const {
      barcodeId,
      boxSize,
      expirationDate,
      purchaseOrder,
      quality,
      skuCode,
      status,
    } = assignedProduct;

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
      },
    });

    const binsPromise = prisma.bins.findMany({
      where: {
        racks: { categoriesId: (await categoryPromise)?.id },
      },
      include: {
        racks: true,
        _count: {
          select: {
            assignedProducts: { where: { status: "Default" || "Queuing" } },
          },
        },
        assignedProducts: { select: { id: true } },
      },
    });

    const [productResult, categories, bins] = await prisma.$transaction([
      productPromise,
      categoryPromise,
      binsPromise,
    ]);

    let remainingQuantity = quantity;
    console.log(remainingQuantity);

    const { dateReceive, expiry } = setTime(expirationDate);
    const binPromises = bins.map((bin) => {
      return setMethod(
        String(productResult?.category),
        bin.id,
        assignedProduct,
        dateReceive
      );
    });

    const availableBins = await Promise.all(binPromises);

    for (let i = 0; i < bins.length; i++) {
      const bin = bins[i];
      const { availableBin } = availableBins[i];

      if (quality === "Good") {
        const newData = {
          boxSize,
          dateReceive,
          purchaseOrder,
          expirationDate: expiry,
          status,
          quality,
          barcodeId,
          skuCode,
          binId: availableBin ? String(availableBin.id) : bin.id,
          usersId,
        };

        if (availableBin) {
          if (!quantity || quantity === 0) {
            await prisma.assignedProducts.create({
              data: newData,
            });
          } else {
            const quantityToInsert = Math.min(
              remainingQuantity,
              bin.capacity - bin._count.assignedProducts
            );

            if (quantityToInsert > 0) {
              const multipleAssignedProduct = Array.from(
                { length: quantityToInsert },
                () => newData
              );

              await prisma.assignedProducts.createMany({
                data: multipleAssignedProduct,
              });

              remainingQuantity -= quantityToInsert;
            }
          }

          const TotalAssignedProduct = await prisma.assignedProducts.count({
            where: {
              binId: bin?.id,
              status: "Default" || "Queuing",
            },
          });

          const capacity = Number(bin?.capacity);
          const binId = bin?.id;
          const rackName = bin.racks?.name;

          if (TotalAssignedProduct >= capacity) {
            await prisma.bins.update({
              where: {
                id: binId,
              },
              data: {
                isAvailable: false,
              },
            });
          }

          const row = availableBin?.row;
          const shelfLevel = availableBin?.shelfLevel;
          console.log(TotalAssignedProduct);
          scanData = {
            message: `Product Added ${TotalAssignedProduct}`,
            quantity,
            capacity,
            row,
            shelfLevel,
            rackName,
          };

          if (bin.capacity >= TotalAssignedProduct) {
            if (remainingQuantity <= 0) {
              break; // Break if all products have been assigned
            }
          }
        }
      } else {
        console.log("Goes to Damage Bin");
        // Handle the case where quality is not "Good"
        console.log("handle damage bin");
      }
    }

    return { scanData };
  } catch (error) {
    return { error };
  }
}

// Update BinWithDate type to include assignedProducts with dateReceive and expiry
type BinWithDate = bins & {
  assignedProducts?: {
    barcodeId: string;
    skuCode: string;
    expirationDate: Date;
    dateReceive: Date; // Assuming dateReceive is part of assignedProducts
  }[];
};

// ...

async function setMethod(
  category: string,
  binId: string,
  assignedProduct: TAssignedProducts,
  dateReceive: Date
) {
  let availableBin: BinWithDate | null = null;

  switch (category as Category) {
    case "Food":
    case "Cosmetics":
      console.log("FEFO Method");
      const { expiry } = setTime(assignedProduct.expirationDate);

      availableBin = await prisma.bins.findFirst({
        where: {
          id: binId,
          isAvailable: true,
          assignedProducts: {
            every: {
              barcodeId: {
                equals: assignedProduct.barcodeId,
              },
              skuCode: {
                equals: assignedProduct.skuCode,
              },
              expirationDate: {
                equals: expiry,
              },
            },
          },
        },
      });

      break;
    case "Laundry":
    case "Sanitary":
    case "Cleaning":
      console.log("FIFO Method");

      availableBin = await prisma.bins.findFirst({
        where: {
          id: binId,
          isAvailable: true,
          assignedProducts: {
            every: {
              barcodeId: {
                equals: assignedProduct.barcodeId,
              },
              skuCode: {
                equals: assignedProduct.skuCode,
              },
              dateReceive: {
                equals: dateReceive,
              },
            },
          },
        },
      });
      break;
    default:
      console.log("There is no available bin");
      break;
  }

  console.log(availableBin);

  return { availableBin };
}
