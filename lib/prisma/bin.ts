import prisma from ".";

export async function findAllBin() {
  try {
    const bins = await prisma.bin.findMany({
      include: {
        _count: {
          select: {
            assignment: true,
          },
        },
        racks: {
          include: {
            categories: true,
          },
        },

        assignment: {
          include: {
            products: {
              select: {
                productName: true,
                category: true,
                sku: true,
                barcodeId: true,
                price: true,
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
