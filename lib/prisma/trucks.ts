import prisma from ".";

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
            // need to have status loaded
            orderedProducts: {
              every: {
                binLocations: {
                  some: {
                    assignedProducts: {
                      every: { status: { in: ["OutForDelivery", "Loaded"] } },
                    },
                  },
                },
              },
            },
          },
          select: {
            id: true,
            SO: true,
            authorName: true,
            batchNumber: true,
            clientName: true,
            orderedProducts: {
              select: {
                binLocations: {
                  include: { stockKeepingUnit: { select: { weight: true } } },
                },
              },
            },
          },
        },
      },
    });
    // console.log(trucks);
    return { trucks };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export async function getTruckStaffAccess() {
  console.log("truck staff access..");

  try {
    const trucks = await prisma.trucks.findMany({
      select: {
        id: true,
        truckName: true,
        payloadCapacity: true,
        status: true,
        threshold: true,
        records: {
          where: {
            orderedProducts: {
              some: {
                binLocations: {
                  every: {
                    assignedProducts: {
                      every: { status: "Queuing", quality: "Good" },
                    },
                  },
                },
              },
            },
          },
          select: {
            SO: true,
            id: true,
            authorName: true,
            batchNumber: true,
            clientName: true,
            locationName: true,

            orderedProducts: {
              where: {
                binLocations: {
                  some: {
                    assignedProducts: {
                      every: { status: "Queuing", quality: "Good" },
                    },
                  },
                },
              },
              select: {
                productName: true,
                binLocations: {
                  select: {
                    quantity: true,
                    skuCode: true,
                    assignedProducts: {
                      where: { status: "Queuing", quality: "Good" },
                      select: { id: true, status: true, quality: true },
                    },
                    stockKeepingUnit: { select: { weight: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log(trucks);
    return { trucks };
  } catch (error) {
    console.log(error);
    return { error };
  }
}
export async function getTruckDriverAccess(id: string, status: string) {
  console.log("truck driver access..");
  // needs to filter something to change the display for records level

  /* 
     if the 
  */

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

    const trucks = await prisma.trucks
      .findMany({
        where: driverFilter,
        select: {
          id: true,
          truckName: true,
          plate: true,
          payloadCapacity: true,
          threshold: true,
          status: true,
          driverId: true,
          _count: {
            select: {
              assignedProducts: {
                where: {
                  status: { in: ["OutForDelivery", "Loaded", "Rejected"] },
                  binLocationsId: { isSet: true },
                },
              },
            },
          },
          records: {
            where: {
              trucks: { status: { not: "Empty" } },
              // trucks: { payloadCapacity: { not: 3500 } },

              orderedProducts: {
                some: {
                  binLocations: {
                    some: {
                      assignedProducts: {
                        some: {
                          status: {
                            in: ["OutForDelivery", "Loaded", "Rejected"],
                          },
                          truckName: { not: null },
                          binLocationsId: { isSet: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            select: {
              SO: true,
              id: true,
              authorName: true,
              batchNumber: true,
              clientName: true,
              locationName: true,
              orderedProducts: {
                where: {
                  binLocations: {
                    some: {
                      assignedProducts: {
                        every: {
                          status: {
                            in: [
                              "OutForDelivery",
                              "Loaded",
                              "Rejected",
                              "Delivered",
                            ],
                          },
                          binLocationsId: { isSet: true },
                        },
                      },
                    },
                  },
                },
                include: {
                  binLocations: {
                    include: {
                      assignedProducts: {
                        where: {
                          status: {
                            in: ["OutForDelivery", "Loaded", "Rejected"],
                          },
                          binLocationsId: { isSet: true },
                        },
                        select: {
                          id: true,
                          dateInfo: true,
                          quality: true,
                          status: true,
                        },
                      },
                      stockKeepingUnit: { select: { weight: true } },
                    },
                  },
                },
              },
            },
          },
        },
      })
      .catch((e) => console.log(e));
    console.log(trucks);
    return { trucks };
  } catch (error) {
    return { error };
  }
}
