import prisma from ".";

export async function getTrucks() {
  try {
    const trucks = await prisma.trucks.findMany({});
    return { trucks };
  } catch (e) {
    return { e };
  }
}

export async function getSpecificTrucks() {
  try {
    const trucks = await prisma.trucks.findMany({
      include: {
        records: true,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

export async function updateTrucks(id: string, truckName: string) {
  // const updateSpecificTrucks = await prisma.trucks.update({
  //   where: {
  //     id,
  //   },
  //   data: {
  //     status: "OutForDelivery",
  //   },
  // });

  // const updateSpecificOrder = prisma.orders.update({
  //   where: {
  //     truckName,
  //   },
  //   data: {},
  // });
  console.log("update trucks triggered");
}

export async function getTruckAdminAccess() {
  try {
    const trucks = await prisma.trucks.findMany({
      select: {
        id: true,
        truckName: true,
        plate: true,
        payloadCapacity: true,
        status: true,
      },
    });
    console.log(trucks);
    return { trucks };
  } catch (error) {
    return { error };
  }
}
export async function getTruckStaffAccess() {
  try {
    // const trucks = await prisma.trucks.findMany({
    //   where: { status: "FullLoad" || "HalfFull" || "PartialLoad" || "Empty" },
    //   include: {
    //     records: {
    //       where: {
    //         orderedProducts: {
    //           some: {
    //             assignedProducts: {
    //               some: {
    //                 status: "Queuing",
    //               },
    //             },
    //           },
    //         },
    //       },
    //       include: {
    //         orderedProducts: {
    //           include: {
    //             assignedProducts: {
    //               where: {
    //                 status: "Queuing",
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    const trucks = await prisma.trucks.findMany({
      where: { status: "Empty" },
      select: {
        truckName: true,
        plate: true,
        payloadCapacity: true,
        status: true,
        records: true,
      },
    });
    console.log(trucks);
    return { trucks };
  } catch (error) {
    return { error };
  }
}
