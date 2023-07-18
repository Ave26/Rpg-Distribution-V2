import { binPayload } from "@prisma/client";
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
        const { bins } = await findManyBin(createdRack?.id);

        return { createdRack, bins };
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
      const { bins } = await findManyBin(createdRack?.id);

      console.log(bins);

      return { categories, bins };
    }
  } catch (error) {
    return { error };
  }
};

async function createBin(rackId: string) {
  for (let i = 1; i <= 36; i++) {
    await prisma.bin.create({
      data: {
        racksId: rackId,
        binSection: i,
        capacity: setCapacity(i),
        shelfLevel: String(setShelfLevel(i)),
      },
    });
  }
}

function setShelfLevel(i: number): string {
  switch (i) {
    case 1:
    case 2:
    case 7:
    case 8:
    case 13:
    case 14:
    case 19:
    case 20:
    case 25:
    case 26:
    case 31:
    case 32:
      return "1st";
    case 3:
    case 4:
    case 9:
    case 10:
    case 15:
    case 16:
    case 21:
    case 22:
    case 27:
    case 28:
    case 33:
    case 34:
      return "2nd";
    case 5:
    case 6:
    case 11:
    case 12:
    case 17:
    case 18:
    case 23:
    case 24:
    case 29:
    case 30:
    case 35:
    case 36:
      return "3rd";
    default:
      throw new Error("Invalid Bin value");
  }
}
function setCapacity(threshold: number): number {
  switch (threshold) {
    case 5:
    case 6:
    case 11:
    case 12:
    case 17:
    case 18:
    case 23:
    case 24:
    case 29:
    case 30:
    case 35:
    case 36:
      return 10;
    case 3:
    case 4:
    case 9:
    case 10:
    case 15:
    case 16:
    case 21:
    case 22:
    case 27:
    case 28:
    case 33:
    case 34:
      return 20;
    case 1:
    case 2:
    case 7:
    case 8:
    case 13:
    case 14:
    case 19:
    case 20:
    case 25:
    case 26:
    case 31:
    case 32:
      return 30;
    default:
      throw new Error("Invalid threshold value");
  }
}

async function findManyBin(racksId: string) {
  const bins = await prisma.bin.findMany({
    where: {
      racksId: racksId,
    },
  });
  return { bins };
}

async function formatBin(array: any[]) {
  const transformedArray = Array.from({ length: 6 }, (_, rowIndex) =>
    Array.from({ length: 6 }, (_, colIndex) => {
      const elementIndex = colIndex * 6 + (5 - rowIndex);
      return array[elementIndex]?.binSection || 0;
    })
  );

  console.log(transformedArray);
  return { transformedArray };
}
