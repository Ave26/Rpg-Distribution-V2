import prisma from ".";

export const createRack = async (category: string, rck: string) => {
  try {
    const categories = await prisma.categories.findUnique({
      where: {
        category,
      },
      include: {
        racks: true,
      },
    });
    console.log(categories);

    if (categories) {
      const rack = await prisma.racks.findFirst({
        where: {
          name: rck,
          categoriesId: categories.id,
        },
      });
      console.log(rack);
      if (rack) {
        return { rack };
      } else {
        const createdRack = await prisma.racks.create({
          data: {
            name: rck,
            categoriesId: categories.id,
          },
        });
        await createBin(createdRack?.id);

        // for (let i = 0; i < categories.capacity; i++) {
        //   await prisma.bin.create({
        //     data: {
        //       racksId: createdRack.id,
        //     },
        //   });
        // }

        return { createdRack };
      }
    } else {
      const categories = await prisma.categories.create({
        data: {
          category,
        },
        include: {
          racks: true,
        },
      });

      const createdRack = await prisma.racks.create({
        data: {
          name: rck,
          categoriesId: categories.id,
        },
      });

      await createBin(createdRack?.id);

      // console.log(createdRack)
      // for (let i = 0; i < categories?.capacity; i++) {
      //   await prisma.bin.create({
      //     data: {
      //       racksId: createdRack?.id,
      //     },
      //   });
      // }

      return { categories };
    }
  } catch (error) {
    return { error };
  }
};

async function createBin(rackId: string) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 12; j++) {
      await prisma.bin.create({
        data: {
          capacity: setCapacity(i),
          racksId: rackId,
        },
      });
    }
  }
}

function setCapacity(threshold: number): number {
  switch (threshold) {
    case 0:
      return 10;

    case 1:
      return 20;

    case 2:
      return 30;

    default:
      throw new Error("Invalid threshold value");
  }
}
