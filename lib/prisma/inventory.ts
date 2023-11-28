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

    for (let category of categories) {
      for (let rack of category.racks) {
        const bins = await prisma.bins.findMany({
          where: {
            racksId: rack.id,
          },
          include: { assignedProducts: { where: { status: "Default" } } },
        });

        for (let i = 1; i < bins.length; i++) {
          const currentBin = bins[i];
          const previousBin = bins[i - 1];

          const rackCategory = category.category;
          const prevAssignedProducts = previousBin.assignedProducts;
          const currentAssignedProducts = currentBin.assignedProducts;

          const isSame = isSameAssignedProductData(
            prevAssignedProducts,
            currentAssignedProducts,
            rackCategory
          );

          console.log("all the data is match", isSame);

          if (previousBin.assignedProducts.length === 0) {
            updatedProducts = await prisma.assignedProducts.updateMany({
              where: {
                binId: currentBin.id,
              },
              data: {
                binId: previousBin.id,
              },
            });
          }
        }
      }
    }
    console.log(updatedProducts);

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
      console.log(rackCategory);
      return (allDataNeededIsMatch = prevAssignedProducts.every((prevProduct) =>
        currentAssignedProducts.some((currentProduct) => {
          console.log(
            currentProduct.expirationDate,
            prevProduct.expirationDate
          );
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
          console.log(
            currentProduct.expirationDate,
            prevProduct.expirationDate
          );
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
