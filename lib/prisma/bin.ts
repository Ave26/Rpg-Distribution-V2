import prisma from ".";

export async function findBinByBarcode(barcodeId: string) {
  console.log(barcodeId);
  try {
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
            assignment: {
              where: {
                isMarked: false,
              },
            },
          },
        },

        assignment: {
          select: {
            products: {
              select: {
                barcodeId: true,
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

    const binThatHasCount = bins.filter(
      (bin) => Number(bin._count.assignment) > 0
    );

    console.log(binThatHasCount);
    return { binThatHasCount };
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
            assignment: {
              where: {
                isMarked: false,
              },
            },
          },
        },
        assignment: {
          where: {
            isMarked: false,
          },
          select: {
            products: {
              select: {
                barcodeId: true,
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

    const binThatHasCount = bins.filter((bin) => {
      return Number(bin._count.assignment) > 0;
    });

    return { binThatHasCount };
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

export async function markAssignmentByBins(
  barcodeId: string,
  quantity: number,
  selectedBinIds: string[]
) {
  let threshold: number = quantity;
  const pickedBins = await prisma.bins.findMany({
    where: {
      id: {
        in: selectedBinIds,
      },
    },
    include: {
      assignment: {
        where: {
          isMarked: false,
        },
      },
    },
  });

  const assignmentIdsToUpdate = [];
  for (let bin of pickedBins) {
    for (let assignment of bin?.assignment) {
      if (threshold > 0) {
        assignmentIdsToUpdate.push(assignment?.id);
        threshold--;
        console.log(
          "threshold",
          threshold,
          "marked Assignment",
          assignment.isMarked
        );
      } else {
        break;
      }
    }
  }

  const markedAssignments = await prisma.assignment.updateMany({
    where: {
      id: {
        in: assignmentIdsToUpdate,
      },
    },
    data: {
      isMarked: true,
    },
  });
  return { markedAssignments };
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
