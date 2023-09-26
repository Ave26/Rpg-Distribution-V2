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
        clientName: clientName,
        dateCreated: date,
        usersId: userId,
        destination,
        truck,
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

// type UpdateData = {
//   status: productStatus; // Replace with the actual type from your schema
// };

// export async function update_product_status(orders: orders | undefined) {
//   const productEntries = orders?.productOrdered.map((product) => {
//     return {
//       barcodeId: product.barcodeId,
//       totalQuantity: product.totalQuantity,
//       binIdsEntries: product.binIdsEntries,
//     };
//   });

//   console.log(orders);

//   try {
//     if (productEntries) {
//       for (let productEntry of productEntries) {
//         const { totalQuantity, barcodeId, binIdsEntries } = productEntry;

//         const bins = await prisma.bins.findMany({
//           where: {
//             id: {
//               in: binIdsEntries,
//             },
//           },
//         });

//         for (let productEntry of productEntries) {
//           const { totalQuantity, barcodeId, binIdsEntries } = productEntry;

//           const bins = await prisma.bins.findMany({
//             where: {
//               id: {
//                 in: binIdsEntries,
//               },
//             },
//           });

//           for (let bin of bins) {
//             for (let i = 0; i < totalQuantity; i++) {
//               let data: UpdateData = {
//                 status: "Queuing",
//               };

//               // Specify a unique where clause for each update
//               const whereClause = {
//                 binId: bin.id,
//                 products: {
//                   barcodeId: barcodeId,
//                 },
//                 // Optionally, you can add more conditions here if needed
//               };

//               await prisma.assignedProducts.updateMany({
//                 where: whereClause,
//                 data: data,
//               });
//             }
//           }
//         }

//         // for (let bin of bins) {
//         //   for (let i = 0; i < totalQuantity; i++) {
//         //     let data: UpdateData = {
//         //       status: "Queuing",
//         //     };

//         //     await prisma.assignedProducts.updateMany({
//         //       where: {
//         //         binId: bin.id,
//         //         products: {
//         //           barcodeId: barcodeId,
//         //         },
//         //       },
//         //       data: data,
//         //     });
//         //   }
//         // }
//       }
//     }

//     // console.log(assignedProducts);
//     /* - Assign the selected products to be queued
// e.g awaut prisma.assignedProducts.updateMany({
//       where: {
//             in: []
//       }
//   })

// Prind the actual bin ids for every barcode

// for (let order of orders){
//     let quantity = 12
//     let barcodeArray = []
//     for (let i = 0; i < quantity; i++){

//            barcode.splice(i, order.barcodeId)

//     }
// prisma.assignedProducts.updateMany()
// } */
//   } catch (error) {
//     return { error };
//   }
// }

type UpdateData = {
  status: productStatus; // Replace with the actual type from your schema
};

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
                status: "default",
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
              console.log(
                "threshold",
                order.totalQuantity,
                "marked Assignment",
                assinedProduct.status
              );
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
