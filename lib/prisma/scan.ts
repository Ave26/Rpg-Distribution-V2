import { categories } from "@prisma/client";
import prisma from ".";

export async function findCategory(barcodeId: string, rackName: string) {
  // this will find all the racks that is base on the category
  let data = new Object();
  try {
    const product = await prisma.products.findUnique({
      where: {
        barcodeId,
      },
    });
    if (product) {
      const category = await prisma.categories.findFirst({
        where: {
          category: product?.category,
        },
      });
      if (category !== null) {
        const racks = await prisma.racks.findMany({
          where: {
            categoriesId: category.id,
          },
        });

        const rack = await prisma.racks.findFirst({
          where: {
            name: rackName,
            categoriesId: category.id,
            isAvailable: true,
          },
          include: {
            bin: true,
          },
        });
        const bin = rack?.bin;
        data = { racks, bin };
      }
    }
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function scanBarcode(
  barcodeId: string,
  boxValue: string,
  expiration: string,
  quantity: number,
  binId: string,
  purchaseOrder: string
) {
  try {
    const { capacity } = setCapacity(boxValue);
    const product = await prisma.products.findUnique({
      where: {
        barcodeId,
      },
    });

    const { availableBin }: any = await updateBinCapacity(binId, capacity);
    console.log(availableBin);
    const { totalCount }: any = await getAssignmentTotalCount(binId);
    console.log(`Capacity ${capacity}, Total Assigned Product ${totalCount}`);
    const { availability } = await checkAndUpdateIfBinCapacityMaxOut(
      availableBin,
      totalCount
    );

    return availability
      ? await insertAssignment(
          availableBin?.id,
          purchaseOrder,
          product,
          quantity,
          expiration,
          availableBin,
          totalCount,
          capacity
        )
      : {
          message: `Quantity: ${quantity}, Total Count: ${totalCount}, Capacity: ${availableBin?.capacity}}`,
        };
  } catch (error) {
    return { error };
  }
}

async function findBin(binId: string) {
  try {
    const bin = await prisma.bin.findUnique({
      where: {
        id: binId,
      },
    });
    return { bin };
  } catch (error) {
    return { error };
  }
}

async function checkAndUpdateIfBinCapacityMaxOut(
  bin: any,
  totalAssignment: number
) {
  try {
    let availability;
    if (bin?.capacity <= totalAssignment) {
      const updateBin = await prisma.bin.update({
        where: {
          id: bin?.id,
        },
        data: {
          isAvailable: false,
        },
      });
      availability = Boolean(updateBin?.isAvailable);
      console.log(Boolean(updateBin?.isAvailable));
    } else {
      const updateBin = await prisma.bin.update({
        where: {
          id: bin?.id,
        },
        data: {
          isAvailable: true,
        },
      });
      console.log(Boolean(updateBin?.isAvailable));

      availability = Boolean(updateBin?.isAvailable);
    }

    return { availability };
  } catch (error) {
    return { error };
  }
}

async function getAssignmentTotalCount(binId: string) {
  try {
    const totalCount = await prisma.assignment.count({
      where: {
        binId,
      },
    });
    return { totalCount };
  } catch (error) {
    return { error };
  }
}

async function updateBinCapacity(binId: string, capacity: number) {
  try {
    let availableBin = new Object();
    const { bin } = await findBin(binId);

    if (bin?.capacity) {
      availableBin = bin;
    } else {
      const data = await prisma.bin.update({
        where: {
          id: binId,
        },
        data: {
          capacity,
        },
      });
      console.log(data);
      availableBin = data;
    }
    return { availableBin };
  } catch (error) {
    return { error };
  }
}

async function insertAssignment(
  binId: string,
  purchaseOrder: string,
  product: any,
  quantity: number,
  expiration: string,
  availableBin: any,
  totalCount: number,
  capacity: number
) {
  try {
    const { date } = dateFormatter();
    let assignment;
    console.log(`quantity: ${quantity}`);
    if (quantity) {
      if (quantity + totalCount > capacity) {
        console.log(
          `Quantity: ${quantity}, Total Count: ${totalCount}, Capacity: ${capacity}}`
        );
        console.log("quantity exceeded");
        return assignment;
      }
      for (let i = 0; i < quantity; i++) {
        const data = await prisma.assignment.create({
          data: {
            productId: product?.id,
            binId,
            purchaseOrder,
            dateReceive: date,
            expirationDate: expiration,
          },
        });
        console.log("incremental entry");
        assignment = data;
      }
    } else {
      const data = await prisma.assignment.create({
        data: {
          productId: product?.id,
          binId,
          purchaseOrder,
          dateReceive: date,
          expirationDate: expiration,
        },
      });
      console.log("new entry");
      return (assignment = data);
    }
    await checkAndUpdateIfBinCapacityMaxOut(availableBin, totalCount);
    await getAssignmentTotalCount(binId);
    return { assignment };
  } catch (error) {
    return { error };
  }
}

function dateFormatter() {
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString();
  return { date };
}

function setCapacity(boxSize: string) {
  let capacity = 0;
  switch (boxSize) {
    case "Small":
      capacity = 20;
      break;
    case "Medium":
      capacity = 15;
      break;
    case "Large":
      capacity = 10;
      break;
    default:
      break;
  }

  return { capacity };
}

// if a bin is still available then just create assignment otherwise create bin

// export const setMaxQuantity = async (boxValue: string) => {
//   try {
//     switch (boxValue) {
//       case "Small":
//         console.log(`set bin quantity to ${20}`);
//         return { maxQuantity: 20 };

//       case "Medium":
//         console.log(`set bin quantity to ${15}`);
//         return { maxQuantity: 15 };

//       case "Large":
//         console.log(`set bin quantity to ${5}`);
//         return { maxQuantity: 5 };

//       default:
//         console.log("Size does not matter");
//         break;
//     }
//   } catch (error) {
//     return { error };
//   }
// };

// export const createAssignment = async (
//   product: any,
//   currentAvailableBin: any,
//   totalQuantity: number,
//   currentAvailableRack: any,
//   maxQuantity: number,
//   assignment: any
// ) => {
//   if (totalQuantity >= currentAvailableBin?.maxQuantity) {
//     await prisma.bin.update({
//       where: {
//         id: currentAvailableBin?.id,
//       },
//       data: {
//         isAvailable: false,
//       },
//     });
//   } else {
//     await prisma.bin.update({
//       where: {
//         id: currentAvailableBin?.id,
//       },
//       data: {
//         isAvailable: true,
//       },
//     });

//     const assignment = await prisma.assignment.findFirst({
//       where: {
//         productId: product.id,
//       },
//     });

//     if (assignment) {
//       // if assignment is
//       if (assignment.quantity !== null) {
//         const data = await prisma.assignment.update({
//           where: {
//             id: assignment.id,
//           },
//           data: {
//             quantity: assignment.quantity + 1,
//           },
//         });

//         return { data };
//       }
//     } else {
//       const currentDate = new Date();
//       const date = currentDate.toLocaleDateString();
//       const data = await prisma.assignment.create({
//         data: {
//           quantity: 1,
//           productId: product.id,
//           dateReceive: date,
//           binId: currentAvailableBin?.id,
//         },
//       });
//       return { data };
//     }
//     return { assignment };
//   }
// };

// export const checkBinCapacity = async (
//   maxValue: number,
//   currentValue: number
// ) => {};

// export const createBin = async (
//   maxQuantity: number,
//   currentAvailableRack: any
// ) => {
//   const newBin = await prisma.bin.create({
//     data: {
//       maxQuantity,
//       racksId: currentAvailableRack?.id,
//     },
//   });

//   return { newBin };
// };

// the A is already there, need to remove it if there is no product found in the bin
// need to set the capacity in the right way
// need to be stable
// {racksId: ObjectId('64abd68f6f8344377930e50c')"}
