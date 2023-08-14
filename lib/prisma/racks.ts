import prisma from ".";

export async function setUpRack(
  rackCategory: string,
  rackName: string,
  numberOfBins: number,
  shelfLevel: number
) {
  const categories = await prisma.categories.findFirst({
    where: {
      category: rackCategory,
    },
  });

  if (categories) {
    const rack = await prisma.racks.findFirst({
      where: {
        categoriesId: categories?.id,
        name: rackName,
      },
    });

    if (rack) {
      return { rack, message: "Rack is Already Created" };
    } else {
      const createdRack = await prisma.racks.create({
        data: {
          name: rackName,
          categoriesId: categories?.id,
        },
      });

      const { newBin } = await set_shelfLevel_and_capacity(
        numberOfBins,
        shelfLevel,
        createdRack
      );
      return { newBin, message: "Rack and Bin Created" };
    }
  } else {
    // create category, rack and bins
    const newCategory = await prisma.categories.create({
      data: {
        category: rackCategory,
      },
      include: {
        racks: true,
      },
    });

    const newRack = await prisma.racks.create({
      data: {
        name: rackName,
        categoriesId: newCategory?.id,
      },
    });

    const { newBin } = await set_shelfLevel_and_capacity(
      numberOfBins,
      shelfLevel,
      newRack
    );

    return { newBin, message: "Category, Rack and Bin Created" };
  }
}

async function set_shelfLevel_and_capacity(
  numberOfBins: number,
  shelfLevel: number,
  rack: any
) {
  const binData = [];
  for (let i = 0; i < numberOfBins; i++) {
    const shelfNumber =
      i % shelfLevel === 0 ? 1 : Number((i % Number(shelfLevel)) + 1);
    const row = Math.floor(i / shelfLevel) + 1;
    const capacity = getBinCapacity(shelfLevel);
    const binCapacity = Array.isArray(capacity)
      ? Number(capacity[i % Number(capacity.length)])
      : capacity;

    binData.push({
      racksId: rack?.id,
      capacity: Number(binCapacity),
      shelfLevel: shelfNumber,
      row,
    });
  }

  const newBin = await prisma.bin.createMany({
    data: binData,
  });

  return { newBin };
}

function getBinCapacity(shelfLevel: number): number[] | number | number {
  switch (shelfLevel) {
    case 1:
      return [100];
    case 2:
      return [100, 70];
    case 3:
      return [100, 70, 50];
    case 4:
      return [100, 100, 70, 50];
    case 5:
      return [100, 100, 70, 70, 50];
    default:
      return 0;
  }
}

export async function findBin(barcodeId: string) {
  const product = await prisma.products.findUnique({
    where: {
      barcodeId,
    },
  });

  if (product) {
    const categories = await prisma.categories.findFirst({
      where: {
        category: product?.category,
      },
    });

    const racks = await prisma.racks.findFirst({
      where: {
        categoriesId: categories?.id,
      },
      include: {
        bin: {
          where: {
            isSeleted: false,
          },
          include: {
            _count: {
              select: {
                assignment: true,
              },
            },
            assignment: true,
          },
        },
      },
    });
    return racks;
  }
}

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
            categories: {
              include: {
                racks: true,
              },
            },
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
