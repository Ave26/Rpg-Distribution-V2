import prisma from ".";

export const createRack = async (category: string, section: string) => {
  try {
    const rackFound = await prisma.racks.findUnique({
      where: {
        section,
      },
    });

    if (rackFound) {
      return { rackFound };
    }

    const rack = await prisma.racks.create({
      data: {
        category,
        section,
      },
    });
    return { rack };
  } catch (error) {
    return { error };
  }
};
