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

      for (let i = 0; i < categories?.capacity; i++) {
        await prisma.bin.create({
          data: {
            racksId: createdRack?.id,
          },
        });
      }

      return { categories };
    }
  } catch (error) {
    return { error };
  }
};
