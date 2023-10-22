import prisma from ".";
import { EntriesTypes } from "@/types/binEntries";
import { setTime } from "@/helper/_helper";
import {
  orders as PrismaOrders,
  productStatus,
  users as PrismaUsers,
} from "@prisma/client";
import { TFormData } from "@/types/inputTypes";
import { Orders } from "@/types/ordersTypes";

export async function make_log_report(
  orderReport: EntriesTypes[],
  formData: TFormData,
  userId: string
) {
  try {
    const { date } = setTime();
    const { clientName, destination, truck } = formData;
    const orders: Orders = await prisma.orders.create({
      data: {
        clientName,
        dateCreated: date,
        usersId: userId,
        destination,
        truckName: truck,
        productOrdered: orderReport,
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    await update_product_status(orders);

    return { orders };
  } catch (error) {
    return { error };
  }
}

export async function update_product_status(orders: Orders | undefined) {
  let updatedProducts;
  try {
    if (orders) {
      for (let order of orders.productOrdered) {
        const bins = await prisma.bins.findMany({
          where: {
            id: {
              in: order.binIdsEntries,
            },
          },
          include: {
            assignedProducts: {
              where: {
                products: {
                  barcodeId: order.barcodeId,
                },
                status: "Default",
              },
            },
          },
        });

        const assignedProductToUpdate = [];
        for (let bin of bins) {
          for (let assinedProduct of bin?.assignedProducts) {
            if (order.totalQuantity > 0) {
              assignedProductToUpdate.push(assinedProduct?.id);
              order.totalQuantity--;
              // console.log(
              //   "threshold",
              //   order.totalQuantity,
              //   "marked Assignment",
              //   assinedProduct.status
              // );
            } else {
              break;
            }
          }
        }
        console.log(assignedProductToUpdate);
        const udpatedData = await prisma.assignedProducts.updateMany({
          where: {
            id: {
              in: assignedProductToUpdate,
            },
          },
          data: {
            status: "Queuing",
          },
        });
        updatedProducts = udpatedData;
      }
    }

    return { updatedProducts };
  } catch (error) {
    return { error };
  }
}

export async function getReport() {
  try {
    const reports = await prisma.orders.findMany({
      include: {
        trucks: true,
        users: {
          select: {
            username: true,
          },
        },
      },
    });

    return { reports };
  } catch (error) {
    return { error };
  }
}

export async function updateReport(orderId: string) {
  try {
    const orders = await prisma.orders.findUnique({
      where: {
        id: orderId,
      },
      include: {
        trucks: true,
      },
    });

    await prisma.trucks.update({
      where: { name: orders?.trucks?.name },
      data: { status: "Loaded" },
    });

    let updatedProducts;
    try {
      if (orders) {
        for (let order of orders.productOrdered) {
          const bins = await prisma.bins.findMany({
            where: {
              id: {
                in: order.binIdsEntries,
              },
            },
            include: {
              assignedProducts: {
                where: {
                  products: {
                    barcodeId: order.barcodeId,
                  },
                  status: "Queuing",
                },
              },
            },
          });

          const assignedProductToUpdate = [];
          for (let bin of bins) {
            for (let assinedProduct of bin?.assignedProducts) {
              if (order.totalQuantity > 0) {
                assignedProductToUpdate.push(assinedProduct?.id);
                order.totalQuantity--;
              } else {
                break;
              }
            }
          }
          const udpatedData = await prisma.assignedProducts.updateMany({
            where: {
              id: {
                in: assignedProductToUpdate,
              },
            },
            data: {
              status: "Loaded",
            },
          });
          updatedProducts = udpatedData;
        }
      }

      return { updatedProducts };
    } catch (error) {
      return { error };
    }
  } catch (error) {
    return { error };
  }
}
