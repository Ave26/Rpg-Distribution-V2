import prisma from ".";

export async function findBinByBarcode(barcodeId: string) {
  try {
    // I want just return bins that has some of the assignment barcode id

    /**
       - The bin will only display the selected bin if the use was the one
       who selected it otherwise the selected bin will not appear to a different
       use unless it has data


     */

    const bins = await prisma.bin.findMany({
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
    const bins = await prisma.bin.findMany({
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

    return { bins };
  } catch (error) {
    return { error };
  }
}

export async function updateSelectedBin(binId: string) {
  try {
    await prisma.bin.update({
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
  binId?: string;
  quantity?: number;
  userId?: string;
}
export async function selectAndUpdateBinByQuantity(params: Prams) {
  const { binId, quantity, userId } = params;
  try {
    // Quantity to be mark on the selected bin
    const quantityTobeMark = 2000;
    // markedAssignement.all -> updateSelectedBin
    const selectedBin = await prisma.bin.findUnique({
      where: {
        id: binId,
      },
      include: {
        _count: {
          select: {
            assignment: true,
          },
        },
      },
    });

    console.log(selectedBin);
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

/**
 Create an function that can eliminate germs 

 if the quantity of the eliminator = 2000 then 
 
  create a loop that eleminate the germs for each value

  Actions: 

  - user logs in the selection
  - upon selecting the user logs will triggered
  - 
  
 */
