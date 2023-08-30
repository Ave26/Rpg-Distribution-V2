import { equal } from "assert";
import prisma from ".";

export async function findBinByBarcode(barcodeId: string) {
  try {
    // I want just return bins that has some of the assignment barcode id

    /**
       - The bin will only display the selected bin if the use was the one
       who selected it otherwise the selected bin will not appear to a different
       use unless it has data


     */

    const bins = await prisma.bins.findMany({
      where: {
        assignment: {
          some: {
            products: {
              barcodeId,
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            assignment: true,
          },
        },
        assignment: {
          select: {
            products: {
              select: {
                productName: true,
                sku: true,
                price: true,
              },
            },
          },
        },
        racks: {
          select: {
            name: true,
            categories: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    });
    return { bins };
  } catch (error) {
    return { error };
  }
}

export async function findAllBin() {
  try {
    const bins = await prisma.bins.findMany({
      where: {
        assignment: {
          some: {
            products: {},
          },
        },
      },

      include: {
        _count: {
          select: {
            assignment: true,
          },
        },
        assignment: {
          select: {
            products: {
              select: {
                productName: true,
                sku: true,
                price: true,
              },
            },
          },
        },
        racks: {
          select: {
            name: true,
            categories: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    });
    console.log(bins);
    return { bins };
  } catch (error) {
    return { error };
  }
}

export async function updateSelectedBin(binId: string) {
  try {
    await prisma.bins.update({
      where: {
        id: binId,
      },
      data: {
        isSelected: true,
      },
    });

    return { message: "Bin is selected" };
  } catch (error) {
    return { error };
  }
}

interface Prams {
  selectedBins?: string[];
  quantity?: number;
  userId?: string;
}

export async function selectAndUpdateBinByQuantity(params: Prams) {
  const { selectedBins, quantity, userId } = params;
  try {
    // Quantity to be mark on the selected bin
    const quantityTobeMark = 2000;
    // markedAssignement.all -> updateSelectedBin
    const binIds = [
      "64cbb95437f82bfa13fb3423",
      "64cbb95437f82bfa13fb3424",
      "64d85d5dde3c3ba032dea61c",
    ];
    // I want to find a list bins

    const selectedBins = await prisma.bins.findMany({
      where: {
        OR: binIds.map((id) => ({
          id: { equals: id },
        })),
      },
    });
    console.log(selectedBins);

    // who selected it // after selected the bin : it will update the logs
    /**
     * - I want to find the bin that is being selected
     * if (isSelected || assignment._count <= )
     * bin -> select -> update bin selected
     */

    // console.log(selectedBins);
    // return { selectedBins };
  } catch (error) {
    return { error };
  }
}

export async function eliminator(binId: string, quantity: string) {
  quantity = quantity + 2000;
  // I have the marked the assignments
}

export async function selectBin(binId: string) {
  try {
    const bin = await prisma.bins.findUnique({
      where: {
        id: binId,
      },
    });

    const newSelectedBin = !bin?.isSelected;
    const selectedBin = await prisma.bins.update({
      where: {
        id: binId,
      },
      data: {
        isSelected: newSelectedBin,
      },
    });

    // setTimeout(async () => {
    //   const updatedBin = await prisma.bin.update({
    //     where: {
    //       id: binId,
    //     },
    //     data: {
    //       isSelected: false,
    //     },
    //   });
    //   console.log(
    //     "isSelected set back to false after 5 seconds for bin:",
    //     updatedBin.id
    //   );
    // }, 5000); // 5000 milliseconds = 5 seconds

    return { selectedBin };
  } catch (error) {
    return { error };
  }
}

/**
 Create an function that can eliminate germs 

 if the quantity of the eliminator = 2000 then 
 
  create a loop that eleminate the germs for each value

  Actions: 

  - user logs in the selection
  - upon selecting the user logs will triggered
  - 
  
 */
