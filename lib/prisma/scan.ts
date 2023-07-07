import prisma from ".";

export const scanBarcode = async (barcodeId: string, boxValue: string) => {
  console.log(boxValue);
  try {
    const product = await prisma.products.findUnique({
      where: {
        barcodeId,
      },
    });

    if (product) {
      // see if there is equal category in product and categories
      const categories = await prisma.categories.findFirst({
        where: {
          category: product.category,
        },
        include: {
          racks: true,
        },
      });
      console.log("rack category", categories?.category);

      if (categories) {
        const racks = await prisma.racks.findMany({
          where: {
            categoriesId: categories.id,
          },
          include: {
            _count: {
              select: {
                bin: true,
              },
            },
          },
        });
        console.log("available racks: ", racks);
        if (racks) {
          // find all the section based on barcode Id
          racks.forEach((rackItem: any) => {
            const binCount = rackItem._count.bin;
            console.log(`Bin count: ${binCount} in section: ${rackItem.id}`);
            if (binCount >= categories.binQuantity) {
              // if the binCount is exceeded then go to another rack
              return updateSection(
                "exceeded",
                rackItem.id,
                rackItem.status,
                boxValue,
                categories.id
              );
            } else {
              return updateSection(
                // if binCount is available then create new Bin
                "available",
                rackItem.id,
                rackItem.status,
                boxValue,
                categories.id
              );
            }
          });
        }
      }
    }

    if (product) {
      const assignment = await prisma.assignment.findFirst({
        where: {
          productId: product.id,
        },
      });

      if (assignment) {
        if (assignment.quantity !== null) {
          const data = await prisma.assignment.update({
            where: {
              id: assignment.id,
            },
            data: {
              quantity: assignment.quantity + 1,
            },
          });
          console.log("updated");
          return { data };
        }
      } else {
        console.log("need to create");
        const currentDate = new Date();
        const date = currentDate.toLocaleDateString();
        const data = await prisma.assignment.create({
          data: {
            quantity: 1,
            productId: product.id,
            dateReceive: date,
          },
        });
        return { data };
      }
      return { assignment };
    }
  } catch (error) {
    return { error };
  }
};

export const updateSection = async (
  data: string,
  id: string,
  status: string | null,
  boxValue: string,
  categories: any
) => {
  switch (data) {
    case "exceeded":
      await prisma.racks.update({
        where: {
          id,
        },
        data: {
          status: "exceeded",
        },
      });

      console.log(status, id);
      break;
    case "available":
      const section = await prisma.racks.updateMany({
        where: {
          id,
        },
        data: {
          status: "available",
        },
      });
      console.log(section, "this is in the available status");
      await setMaxQuantity(boxValue, categories);
      break;

    default:
      break;
  }
};

export const createBin = async (maxQuantity: number, cateogryId: any) => {
  console.log(maxQuantity);
  const rack = await prisma.racks.findMany({
    where: {
      categoriesId: cateogryId,
    },
  });
  if (rack) { // it needs to create bin and insert all the assignment
    const bin = await prisma.bin.create({
      data: {
        maxQuantity,
      },
    });
  }
  console.log(rack, "this is rack");
  const assignment = await prisma.assignment.findMany({});

  console.log(assignment);
};

export const setMaxQuantity = async (maxSize: string, categories: any) => {
  try {
    switch (maxSize) {
      case "Small":
        console.log(`set bin quantity to ${20}`);
        // setBinQuantity(12);
        return await createBin(20, categories);

      case "Medium":
        console.log(`set bin quantity to ${15}`);
        // setBinQuantity(10);
        return await createBin(15, categories);

      case "Large":
        console.log(`set bin quantity to ${10}`);
        // setBinQuantity(6);
        return await createBin(10, categories);

      default:
        console.log("Size does not matter");
        break;
    }
  } catch (error) {
    return { error };
  }
};
