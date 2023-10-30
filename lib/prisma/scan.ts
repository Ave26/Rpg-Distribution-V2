import prisma from ".";
import {
  bins,
  products,
  assignedProducts,
  ProductQuality,
} from "@prisma/client";

export async function scanBarcode(
  barcodeId: string,
  purchaseOrder: string,
  boxSize: string,
  expirationDate: Date,
  quality: ProductQuality,
  quantity: number
) {
  try {
    const product = await prisma.products.findUnique({
      where: {
        barcodeId,
      },
    });

    if (!product) {
      return { message: "Product Not found" };
    } else {
      if (quality === "Good") {
        const categories = await prisma.categories.findFirst({
          where: {
            category: product?.category,
          },
        });
        console.log({ model: "Category Model", categories });
        const racks = await prisma.racks.findFirst({
          where: {
            categoriesId: categories?.id,
          },
        });

        const bins = await prisma.bins.findMany({
          where: {
            racksId: racks?.id,
          },
          include: {
            assignedProducts: true,
          },
        });

        for (const bin of bins) {
          const { dateReceive } = setTime();

          let { availableBin } = await setMethod(
            String(categories?.category),
            bin,
            product,
            expirationDate,
            dateReceive
          );

          const newData = {
            productId: product?.id,
            binId: String(availableBin?.id),
            quality,
            boxSize,
            dateReceive,
            purchaseOrder,
            expirationDate,
          };

          if (availableBin) {
            if (!quantity || quantity === 0) {
              await prisma.assignedProducts.create({
                data: newData,
              });
            } else {
              let multipleAssignedProduct = [];
              for (let i = 0; i < quantity; i++) {
                multipleAssignedProduct.push(newData);
              }
              await prisma.assignedProducts.createMany({
                data: multipleAssignedProduct,
              });
            }

            const TotalAssignedProduct = await prisma.assignedProducts.count({
              where: {
                binId: bin?.id,
                status: "Default" || "Queuing",
              },
            });

            const capacity = Number(bin?.capacity);
            const binId = bin?.id;

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

            return {
              message: `Product Added ${TotalAssignedProduct}`,
              TotalAssignedProduct,
              capacity,
              row,
              shelfLevel,
            };
          }
        }
      }
    }
  } catch (error) {
    return { error };
  }
}

function setTime() {
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

  return { dateReceive };
}

async function setMethod(
  category: string,
  bin: bins,
  product: products,
  expirationDate: Date,
  dateReceive: Date
) {
  let availableBin;
  console.log(category);
  switch (category) {
    case "Food":
      console.log("FEFO Method");

      availableBin = await prisma.bins.findFirst({
        where: {
          id: bin?.id,
          isAvailable: true,
          assignedProducts: {
            every: {
              productId: {
                equals: product?.id,
              },
              expirationDate: {
                equals: expirationDate,
              },
            },
          },
        },
      });

      break;
    case "Laundry":
    case "Cosmetics":
    case "Sanitary":
    case "Cleaning":
      console.log("FIFO Method");

      availableBin = await prisma.bins.findFirst({
        where: {
          id: bin?.id,
          isAvailable: true,
          assignedProducts: {
            every: {
              productId: {
                equals: product?.id,
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
      console.log("No Categories Found");
      break;
  }
  return { availableBin };
}
