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
            },
          });
        }
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
  const { clientName, destination, truck: truckName } = formData;
  try {
    const { date: dateCreated } = setTime();
    const user = await prisma.users.findUnique({
      where: {
        id: authorId,
      },
      select: {
        username: true,
      },
    });

    const omittedProductEntry = productEntry.map((entry) => {
      const { expiryDate, price, productName, sku, ...rest } = entry;
      return rest;
    });

    const orders = await prisma.records.create({
      data: {
        clientName,
        destination,
        username: String(user?.username),
        dateCreated,
        truckName,

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
    console.log(orders);

    await update_product_status(orders);
    return { orders };
  } catch (error) {
    return { error };
  }
}

export async function update_product_status(records: TRecords) {
  let updatedProducts;
  const updatedProductIds = [];
  try {
    for (let orderedProduct of records.orderedProducts) {
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
        updatedProducts = updatedAssignedProducts;
      }

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
        trucks: true,
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
    console.log(orders);
    // await updateStatus_and_assignProducts(orders);
    return { orders };
  } catch (error) {
    return { error };
  }
}
