import { Bin } from "@/types/inventory";
import prisma from ".";

export async function findBinByBarcode(barcodeId: string) {
  try {
    // I want just return bins that has some of the assignment barcode id
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
        isSeleted: true,
      },
    });

    return { message: "Bin is selected" };
  } catch (error) {
    return { error };
  }
}
