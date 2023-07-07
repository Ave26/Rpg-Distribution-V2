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

    if (categories) {
      const rack = await prisma.racks.findFirst({
        where: {
          name: rck,
          categoriesId: categories.id,
        },
      });
      if (rack) {
        return { rack };
      } else {
        const createdRack = await prisma.racks.create({
          data: {
            name: rck,
            categoriesId: categories.id,
            status: "Available",
          },
        });

        return { createdRack };
      }
    } else {
      const categoriesAndRack = await prisma.categories.create({
        data: {
          category,
          racks: {
            create: {
              name: rck,
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
