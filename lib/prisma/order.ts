import { setTime } from "@/helper/_helper";
import prisma from ".";
import { EntriesTypes } from "@/types/binEntries";
import { TFormData } from "@/types/inputTypes";
import {
  records,
  trucks as TTrucks,
  orderedProducts,
  assignedProducts as TAssignedProducts,
  products as TProducts,
  assignedProducts,
} from "@prisma/client";

type TOrderedProducts = orderedProducts & {
  assignedProducts: TAssignedProducts[];
};

type TRecords = records & {
  orderedProducts: TOrderedProducts[];
};

export async function update_order(recordId: string) {
  try {
    let updatedProducts;

    const record = await prisma.records.findUnique({
      where: {
        id: recordId,
      },
      include: {
        orderedProducts: {
          include: {
            assignedProducts: true,
          },
        },
      },
    });

    if (record && record.orderedProducts) {
      const orderedProducts = record.orderedProducts;

      for (let orderProduct of orderedProducts) {
        const assignedProducts = orderProduct.assignedProducts;

        if (assignedProducts) {
          updatedProducts = await prisma.assignedProducts.updateMany({
            where: {
              id: {
                in: assignedProducts.map(
                  (assignedProduct) => assignedProduct.id
                ),
              },
            },
            data: {
              status: "Loaded",
              binId: {
                unset: true,
              },
            },
          });
        }
      }
    }

    const bins = await prisma.bins.findMany({
      include: {
        _count: {
          select: {
            assignedProducts: true,
          },
        },
      },
    });
    for (let bin of bins) {
      const assignedProductCount = bin._count.assignedProducts;

      if (assignedProductCount === 0 || assignedProductCount < bin.capacity) {
        const updateBin = await prisma.bins.updateMany({
          where: {
            id: bin.id,
          },
          data: {
            isAvailable: true,
          },
        });
        console.log("Empty Bin Updated", updateBin);
      }
    }
    console.log(updatedProducts);

    return { updatedProducts };
  } catch (error) {
    return { error };
  }
}

export async function create_order(
  productEntry: EntriesTypes[],
  formData: TFormData,
  authorId: string
) {
  console.log(productEntry, formData);
  const { clientName, destination, truck: truckName } = formData;
  try {
    let record: TRecords | undefined;
    const { date: dateCreated } = setTime();
    const user = await prisma.users.findUnique({
      where: {
        id: authorId,
      },
      select: {
        username: true,
      },
    });

    console.log(user);

    const omittedProductEntry = productEntry.map((entry) => {
      const { expiryDate, price, productName, skuCode, ...rest } = entry;
      return rest;
    });

    const poo = await prisma.purchaseOrderOutBound.findUnique({
      where: {
        poId: formData.purchaseOrderOutbound, // "test"
      },
    });

    console.log(poo);

    const highest = await prisma.records.findFirst({
      where: {
        poId: poo?.poId,
      },
      select: {
        batchNumber: true,
      },
      orderBy: {
        batchNumber: "desc", // Order by batchNumber in descending order
      },
      take: 1, // Take only the first result (with the highest batchNumber)
    });
    console.log(highest);

    if (poo && highest) {
      record = await prisma.records.create({
        data: {
          clientName,
          destination,
          dateCreated,
          authorName: String(user?.username),
          truckName,
          batchNumber: Number(highest?.batchNumber) + 1, // Assuming this is a non-nullable field of type Int
          poId: poo.poId,
          orderedProducts: {
            createMany: {
              data: omittedProductEntry,
            },
          },
        },
        include: {
          orderedProducts: {
            include: {
              assignedProducts: true,
            },
          },
        },
      });
    } else {
      console.log("Record And POO Created");
      const newPOO = await prisma.purchaseOrderOutBound.create({
        data: {
          poId: formData.purchaseOrderOutbound,
        },
      });

      record = await prisma.records.create({
        data: {
          clientName,
          destination,
          dateCreated,
          authorName: String(user?.username),
          truckName,

          poId: newPOO.poId, // This should be a unique ID from the `purchaseOrderOutBound` table
          orderedProducts: {
            createMany: {
              data: omittedProductEntry,
            },
          },
        },
        include: {
          orderedProducts: {
            include: {
              assignedProducts: true,
            },
          },
        },
      });
    }

    const connectTrucks = await prisma.trucks.update({
      where: {
        truckName: String(truckName),
      },
      data: {
        records: {
          connect: {
            id: record?.id,
          },
        },
      },
      include: {
        records: true,
      },
    });

    // const connectTrucks = await prisma.trucks.update({
    //   where: {
    //     name: String(truckName),
    //   },
    //   data: {
    //     records: {
    //       connect: record ? { id: record.id } : undefined,
    //     },
    //   },
    //   include: {
    //     records: true,
    //   },
    // });

    console.log(connectTrucks);

    const updateTruckCargo = await prisma.trucks.update({
      where: {
        truckName: formData.truck,
      },
      data: {
        payloadCapacity: formData.truckCargo,
      },
    });

    if (updateTruckCargo.payloadCapacity === 0) {
      await prisma.trucks.update({
        where: {
          truckName: String(updateTruckCargo?.truckName),
        },
        data: {
          status: "FullLoad",
        },
      });
    }
    console.log(record);

    console.log(`the ${updateTruckCargo.truckName} cargo has been updated`);
    await update_product_status(record);
    return { record };
  } catch (error) {
    return { error };
  }
}

export async function update_product_status(record: TRecords | undefined) {
  let updatedProducts;
  console.log(record);
  if (!record) {
    return (updatedProducts = null);
  }

  try {
    for (let orderedProduct of record.orderedProducts) {
      const updatedProductIds = [];
      let totalQuantity = orderedProduct.totalQuantity;
      const binIds = orderedProduct.binIdsEntries;

      const bins = await prisma.bins.findMany({
        where: {
          id: {
            in: binIds,
          },
        },
        include: {
          assignedProducts: {
            where: {
              products: {
                barcodeId: orderedProduct.barcodeId,
              },
              status: "Default",
            },
          },
        },
      });

      for (let bin of bins) {
        for (let assignedProduct of bin.assignedProducts) {
          if (totalQuantity > 0) {
            updatedProductIds.push(assignedProduct.id);
            totalQuantity--;
          } else {
            break;
          }
        }

        const updatedAssignedProducts =
          await prisma.assignedProducts.updateMany({
            where: {
              id: {
                in: updatedProductIds,
              },
            },
            data: {
              status: "Queuing",
            },
          });

        await prisma.orderedProducts.update({
          where: {
            id: orderedProduct.id,
          },
          data: {
            assignedProducts: {
              connect: updatedProductIds.map((id) => ({ id })),
            },
          },
        });

        updatedProducts = updatedAssignedProducts;
      }
    }

    return { updatedProducts };
  } catch (error) {
    return { error };
  }
}

export async function get_order() {
  try {
    const orders = await prisma.records.findMany({
      include: {
        trucks: {
          select: {
            payloadCapacity: true,
          },
        },
        author: {
          select: {
            username: true,
          },
        },
        orderedProducts: {
          include: {
            assignedProducts: {
              select: {
                id: true,
                expirationDate: true,
                status: true,
              },
            },
            products: {
              select: {
                productName: true,
                price: true,
                sku: true,
              },
            },
          },
        },
      },
    });
    // await updateStatus_and_assignProducts(orders);
    return { orders };
  } catch (error) {
    return { error };
  }
}
