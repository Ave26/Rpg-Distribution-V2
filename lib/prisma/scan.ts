import { GetResult } from "@prisma/client/runtime/library";
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
  purchaseOrder: string,
  quality: string
) {
  let message;
  try {
    const { capacity } = setCapacity(boxValue);
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

      const rack = await prisma.racks.findFirst({
        where: {
          isAvailable: true,
          categoriesId: category?.id,
        },
      });

      const bin = await prisma.bin.findFirst({
        where: {
          isAvailable: true,
          racksId: rack?.id,
        },
      });

      const assignProduct = await prisma.assignment.create({
        data: {
          binId: bin?.id,
          productId: product?.id,
        },
      });
      console.log(assignProduct);

      const count = await prisma.assignment.count({
        where: {
          binId: bin?.id,
        },
      });
      message = `Product Added Count: ${count}`;
    }
    return { message };

    // const { availableBin } = await updateBinCapacity(bin, capacity);

    // const { totalCount, error } = await getAssignmentTotalCount(binId);

    // await checkAndUpdateIfBinCapacityMaxOut(availableBin, totalCount);

    //   return availability
    //     ? await insertAssignment(
    //         availableBin?.id,
    //         purchaseOrder,
    //         product,
    //         quantity,
    //         expiration,
    //         availableBin,
    //         totalCount,
    //         capacity,
    //         quality
    //       )
    //     : {
    //         message: `Quantity has been exceeded`,
    //       };
  } catch (error) {
    return { error };
  }
}

// async function findBin(binId: string) {
//   try {
//     const bin = await prisma.bin.findUnique({
//       where: {
//         id: binId,
//       },
//     });
//     return { bin };
//   } catch (error) {
//     return { error };
//   }
// }

// async function checkAndUpdateIfBinCapacityMaxOut(
//   bin:
//     | (GetResult<
//         {
//           id: string;
//           isAvailable: boolean;
//           capacity: number | null;
//           racksId: string | null;
//         },
//         { [x: string]: () => unknown }
//       > & {})
//     | undefined,
//   totalAssignment: number | undefined
// ) {
//   try {
//     if (bin?.capacity <= totalAssignment) {
//       const updateBin = await prisma.bin.update({
//         where: {
//           id: bin?.id,
//         },
//         data: {
//           isAvailable: false,
//         },
//       });
//       return { availability: Boolean(updateBin?.isAvailable) };
//     }
//   } catch (error) {
//     return { error };
//   }
// }

// async function getAssignmentTotalCount(binId: string) {
//   try {
//     const totalCount: number = await prisma.assignment.count({
//       where: {
//         binId,
//       },
//     });
//     return { totalCount };
//   } catch (error) {
//     return { error };
//   }
// }

// async function updateBinCapacity(binId: string, capacity: number) {
//   try {
//     const { bin } = await findBin(binId);

//     if (bin?.capacity) {
//       return { bin };
//     } else {
//       const availableBin = await prisma.bin.update({
//         where: {
//           id: binId,
//         },
//         data: {
//           capacity,
//         },
//       });

//       return { availableBin };
//     }
//   } catch (error) {
//     return { error };
//   }
// }

// async function insertAssignment(
//   binId: string | undefined,
//   purchaseOrder: string,
//   product: any,
//   quantity: number,
//   expiration: string,
//   availableBin: any,
//   totalCount: number,
//   capacity: number,
//   quality: string
// ) {
//   try {
//     const { date } = dateFormatter();
//     let assignment;

//     switch (quality) {
//       case "Good":
//         console.log("good triggered");

//         if (quantity) {
//           if (quantity + totalCount > capacity) {
//             console.log("quantity exceeded");
//             return assignment;
//           }
//           for (let i = 0; i < quantity; i++) {
//             const data = await prisma.assignment.create({
//               data: {
//                 productId: product?.id,
//                 binId,
//                 purchaseOrder,
//                 dateReceive: date,
//                 expirationDate: expiration,
//               },
//             });
//             console.log("incremental entry");
//             assignment = data;
//           }
//         } else {
//           const data = await prisma.assignment.create({
//             data: {
//               productId: product?.id,
//               binId,
//               purchaseOrder,
//               dateReceive: date,
//               expirationDate: expiration,
//             },
//           });
//           console.log("new entry");
//           return (assignment = data);
//         }

//         break;
//       case "Damage":
//         console.log("bad triggered");
//         return {
//           message: "moved to the damage area",
//         };

//       default:
//         console.log(
//           "There is no Good and Bad in this world only organic sheeshables"
//         );
//         break;
//     }
//   } catch (error) {
//     return { error };
//   } finally {
//     const { availability: available } = await checkAndUpdateIfBinCapacityMaxOut(
//       availableBin,
//       totalCount
//     );
//     const { totalCount: count } = await getAssignmentTotalCount(binId);

//     return {
//       message: `Quantity: ${quantity}, Total Count: ${count}, Capacity: ${availableBin.capacity}, Availability: ${available}}`,
//       count: count,
//       capacity: availableBin?.capacity,
//       availability: available,
//     };
//   }
// }

// function dateFormatter() {
//   const currentDate = new Date();
//   const formatter = new Intl.DateTimeFormat("en-PH", {
//     dateStyle: "long",
//   });
//   const date = formatter.format(currentDate);
//   return { date };
// }

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

// TASKS:

// Need to vary depending on the quality of the product
// for instance the product is good then make sure to scan and
// push it to the bin base on Category otherwise push it to damage bay

// DAMAGE TYPES: receiving, inside and outside

// We may need to take care of the FEFO, LIFO and FIFO depending on
// what category

function setMethod(category: string) {
  // prototype
  switch (category) {
    case "Food":
      console.log("FEFO Method");
      break;
    case "Laundry":
      console.log("LIFO METHOD");
      break;
    case "Cleaning":
      console.log("FIFO Method");
      break;

    default:
      console.log("Everyone needs hug");
      break;
  }
}

// WE MAY NEED TO ESTABLISH MANUAL AND AUTOMATED FOR BARCODE SCANNER
// manual:
//   Allows the user to manually select on what bin it wanted to choose
//   Allows the use to manually select what quantity it wanted to set

// Automated:
//   Automatically set the bin based on the category and set what method it
//   will choose (FEFO, LIFO and FIFO) to deal with product management
//   Automatically insert a product into a bin

// need to improve
// what if the product has been inserted to the wrong been and the been
// automatically set the capacity

// answer: create a set capacity button
