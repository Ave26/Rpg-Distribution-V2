import { bins, assignedProducts } from "@prisma/client";
import prisma from ".";

type TBins = bins & {
  assignedProducts: assignedProducts[];
};

export async function sortProductBins() {
  try {
    let updatedProducts;

    const categories = await prisma.categories.findMany({
      include: {
        racks: true,
      },
    });

    for (let ct of categories) {
      for (let rack of ct.racks) {
        const bins = await prisma.bins.findMany({
          where: {
            racksId: rack.id,
          },

          include: {
            _count: { select: { assignedProducts: true } },
            assignedProducts: { where: { status: "Default" } },
          },
        });

        for (let i = 1; i < bins.length; i++) {
          const rackCategory = ct.category;
          const currentBin = bins[i];
          const previousBin = bins[i - 1];

          const hasSameProductData = isSameAssignedProductData(
            previousBin.assignedProducts,
            currentBin.assignedProducts,
            rackCategory
          );

          let remainingQuantityToUpdate: number =
            currentBin.assignedProducts.length;

          if (previousBin.assignedProducts.length === 0 || hasSameProductData) {
            console.log("if triggered");
            const quantityToUpdate = Math.min(
              remainingQuantityToUpdate,
              previousBin.capacity - previousBin._count.assignedProducts
            );

            console.log("quantityToUpdate", quantityToUpdate);

            let multipleAssignedProductToBeUpdated: string[] = [];

            if (quantityToUpdate > 0) {
              for (let assignedProduct of currentBin.assignedProducts) {
                multipleAssignedProductToBeUpdated.push(assignedProduct.id);
                const count = multipleAssignedProductToBeUpdated.length;
                if (count >= quantityToUpdate) {
                  break;
                }
              }

              if (multipleAssignedProductToBeUpdated.length > 0) {
                updatedProducts = await prisma.assignedProducts.updateMany({
                  where: {
                    id: {
                      in: multipleAssignedProductToBeUpdated,
                    },
                  },
                  data: {
                    binId: previousBin.id,
                  },
                });
              }

              const diffOfPrevBinCount =
                previousBin.capacity - previousBin._count.assignedProducts;
              const prevBinCount = previousBin._count.assignedProducts;
              console.log(prevBinCount);

              const total = diffOfPrevBinCount + prevBinCount;

              if (previousBin.capacity >= total) {
                await prisma.bins.update({
                  where: {
                    id: previousBin.id,
                  },
                  data: {
                    isAvailable: false,
                  },
                });
              }
            } else {
              console.log("else triggered");
              console.log(
                multipleAssignedProductToBeUpdated.length +
                  previousBin._count.assignedProducts ===
                  previousBin.capacity
              );

              await prisma.bins.update({
                where: {
                  id: previousBin.id,
                },
                data: {
                  isAvailable: false,
                },
              });
            }
          }
        }
      }
    }
    // console.log("updatedProducts", updatedProducts);

    return { updatedProducts };
  } catch (error) {
    return { error };
  }
}

function isSameAssignedProductData(
  prevAssignedProducts: assignedProducts[],
  currentAssignedProducts: assignedProducts[],
  rackCategory: string | null
): boolean | undefined {
  let allDataNeededIsMatch: boolean | undefined = undefined;

  switch (rackCategory) {
    case "Food":
    case "Cosmetics":
      // console.log(rackCategory);
      return (allDataNeededIsMatch = prevAssignedProducts.every((prevProduct) =>
        currentAssignedProducts.some((currentProduct) => {
          return (
            currentProduct.barcodeId === prevProduct.barcodeId &&
            currentProduct.skuCode === prevProduct.skuCode &&
            currentProduct.expirationDate?.getTime() ===
              prevProduct.expirationDate?.getTime()
          );
        })
      ));

    case "Laundry":
    case "Sanitary":
    case "Cleaning":
      return (allDataNeededIsMatch = prevAssignedProducts.every((prevProduct) =>
        currentAssignedProducts.some((currentProduct) => {
          // console.log(
          //   currentProduct.expirationDate,
          //   prevProduct.expirationDate
          // );
          return (
            currentProduct.barcodeId === prevProduct.barcodeId &&
            currentProduct.skuCode === prevProduct.skuCode &&
            currentProduct.dateReceive?.getTime() ===
              prevProduct.dateReceive?.getTime()
          );
        })
      ));

    default:
      break;
  }

  return allDataNeededIsMatch;
}

export function binChecker(bin: TBins) {
  if (bin.assignedProducts.length === 0) {
    return true;
  } else {
    return false;
  }
}
