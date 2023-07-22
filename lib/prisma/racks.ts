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
          categoriesId: categories.id,
        },
      });

      const binData = [];
      for (let i = 1; i <= numberOfBins; i++) {
        const shelfNumber =
          i % shelfLevel === 0
            ? Number(shelfLevel)
            : Number(i % Number(shelfLevel));
        const capacity = getBinCapacity(shelfLevel);
        const binCapacity = Array.isArray(capacity)
          ? capacity[i % capacity.length]
          : capacity;
        console.log(binCapacity);
        binData.push({
          racksId: createdRack?.id,
          capacity: binCapacity,
          shelfLevel: shelfNumber,
        });
      }
      const newBin = await prisma.bin.createMany({
        data: binData,
      });
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

    const binData = [];
    for (let i = 1; i <= numberOfBins; i++) {
      const shelfNumber =
        i % shelfLevel === 0
          ? Number(shelfLevel)
          : Number(i % Number(shelfLevel));

      const capacity = getBinCapacity(shelfLevel);
      const binCapacity = Array.isArray(capacity)
        ? Number(capacity[i % Number(capacity.length)])
        : capacity;

      binData.push({
        racksId: newRack?.id,
        capacity: Number(binCapacity),
        shelfLevel: shelfNumber,
      });
    }
    const newBin = await prisma.bin.createMany({
      data: binData,
    });
    return { newBin, message: "Category, Rack and Bin Created" };
  }
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
