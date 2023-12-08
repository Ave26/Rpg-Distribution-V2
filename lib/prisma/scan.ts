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
  quantity: number
) {
  try {
    const {
      barcodeId,
      boxSize,
      expirationDate,
      purchaseOrder,
      quality,
      skuCode,
      status,
    } = assignedProduct;

    const product = await prisma.products.findUnique({
      where: {
        barcodeId,
      },
      include: {
        sku: {
          where: {
            code: skuCode,
          },
        },
      },
    });

    const category = await prisma.categories.findFirst({
      where: {
        category: product?.category,
      },
    });

    const bins = await prisma.bins.findMany({
      where: {
        racks: {
          categoriesId: category?.id,
        },
      },
      include: {
        racks: true,
        _count: {
          select: {
            assignedProducts: {
              where: {
                status: "Default" || "Queuing",
              },
            },
          },
        },
      },
    });

    let scanData: object | null = null;

    let remainingQuantity = quantity;
    console.log(remainingQuantity);

    for (let bin of bins) {
      const { dateReceive, expiry } = setTime(expirationDate);

      const { availableBin } = await setMethod(
        String(category?.category),
        bin.id,
        assignedProduct,
        dateReceive
      );
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
          binId: String(availableBin?.id),
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

            console.log("remaining quantity:", remainingQuantity);
            console.log(
              "binCapacity - countAssigneProducts:",
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

            // let multipleAssignedProduct = [];
            // for (let i = 0; i < remainingQuantity; i++) {
            //   multipleAssignedProduct.push(newData);

            // }
            // await prisma.assignedProducts.createMany({
            //   data: multipleAssignedProduct,
            // });
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
            message: `Product Added ${quantity}`,
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
      }
    }

    return { scanData };
  } catch (error) {
    return { error };
  }
}

async function setMethod(
  category: string,
  binId: string,
  assignedProduct: TAssignedProducts,
  dateReceive: Date
) {
  let availableBin: bins | null = null;
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

/* 
  IT INSERTS MULTIPLE DATA 
*/
