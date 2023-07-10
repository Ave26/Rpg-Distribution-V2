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

      console.log(rack?.bin);
      data = { racks, bin };
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
  quantity: number
) {
  try {
    // scan a barcode
    // create a bin and set the capacity
    // the bin has can have different Ids
    // the bin has a name
    // insert asignment in the bin based on the quantity
  } catch (error) {
    return { error };
  }
}

function setCapacity(boxSize: string) {
  // capacity setter
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
