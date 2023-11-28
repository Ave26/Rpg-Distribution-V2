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
