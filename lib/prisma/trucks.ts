import prisma from ".";

// export async function getSpecificTrucks() {
//   try {
//     const trucks = await prisma.trucks.findMany({
//       include: {
//         records: true,
//       },
//     });
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function getTrucks() {
//   try {
//     const trucks = await prisma.trucks.findMany({
//       select: {
//         id: true,
//         truckName: true,
//         plate: true,
//         payloadCapacity: true,
//         status: true,
//         records: {
//           select: {
//             poId: true,
//             id: true,
//             authorName: true,
//             batchNumber: true,
//             orderedProducts: true,
//           },
//         },
//       },
//     });

//     return { trucks };
//   } catch (error) {
//     return { error };
//   }
// }

export async function getTruckAdminAccess() {
  console.log("truck admin access..");

  try {
    const trucks = await prisma.trucks.findMany({
      select: {
        id: true,
        truckName: true,
        plate: true,
        payloadCapacity: true,
        threshold: true,
        status: true,
        records: {
          where: {
            orderedProductsTest: {
              some: {
                binLocations: {
                  every: { assignedProducts: { every: { status: "Loaded" } } },
                },
              },
            },
          },
          select: {
            id: true,
            POO: true,
            authorName: true,
            batchNumber: true,
            clientName: true,
            orderedProductsTest: true,
          },
        },
      },
    });

    return { trucks };
    console.log(trucks);
  } catch (error) {
    return { error };
  }

  // try {
  //   const trucks = await prisma.trucks.findMany({
  //     select: {
  //       id: true,
  //       truckName: true,
  //       plate: true,
  //       payloadCapacity: true,
  //       threshold: true,
  //       status: true,
  //       records: {
  //         where: {
  //           orderedProducts: {
  //             every: { assignedProducts: { some: { status: "Loaded" } } },
  //           },
  //         },
  //         select: {
  //           poId: true,
  //           id: true,
  //           authorName: true,
  //           batchNumber: true,
  //           clientName: true,
  //           orderedProducts: true,
  //         },
  //       },
  //     },
  //   });
  //   return { trucks };
  // } catch (error) {
  //   return { error };
  // }
}
export async function getTruckStaffAccess() {
  console.log("truck staff access..");

  try {
    const trucks = await prisma.trucks.findMany({
      select: {
        id: true,
        truckName: true,
        plate: true,
        payloadCapacity: true,
        status: true,
        records: {
          where: {
            orderedProducts: {
              every: {
                assignedProducts: { some: { status: "Queuing" } },
              },
            },
          },
          select: {
            poId: true,
            id: true,
            authorName: true,
            batchNumber: true,
            orderedProducts: true,
          },
        },
      },
    });

    console.log(trucks);
    return { trucks };
  } catch (error) {
    return { error };
  }
}
export async function getTruckDriverAccess(id: string) {
  console.log("truck driver access..");

  try {
    const truck = await prisma.trucks.findFirst({
      where: { driverId: id },
      select: { driverId: true },
    });

    const driverFilter = truck
      ? { driverId: truck.driverId }
      : {
          driverId: {
            isSet: false,
          },
        };

    const trucks = await prisma.trucks.findMany({
      where: driverFilter,
      select: {
        id: true,
        truckName: true,
        plate: true,
        payloadCapacity: true,
        threshold: true,
        status: true,
        driverId: true,
        records: {
          where: {
            orderedProducts: {
              every: { assignedProducts: { some: { status: "Loaded" } } },
            },
          },
          select: {
            poId: true,
            id: true,
            authorName: true,
            batchNumber: true,
            clientName: true,
            orderedProducts: true,
          },
        },
      },
    });

    return { trucks };
  } catch (error) {
    return { error };
  }
}
