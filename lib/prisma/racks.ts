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
        let rackWBin = new Object();
        const createdRack = await prisma.racks.create({
          data: {
            name: rck,
            categoriesId: categories.id,
          },
        });

        for (let i = 0; i < categories.capacity; i++) {
          await prisma.bin.create({
            data: {
              racksId: createdRack.id,
            },
          });
        }

        return { createdRack };
      }
    } else {
      const categoriesAndRack = await prisma.categories.create({
        data: {
          category,
          racks: {
            create: {
              name: rck,
              isAvailable: true,
            },
          },
        },
        include: {
          racks: true,
        },
      });

      return { categoriesAndRack };
    }
  } catch (error) {
    return { error };
  }
};
