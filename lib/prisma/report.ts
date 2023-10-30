// import prisma from ".";
// import { EntriesTypes } from "@/types/binEntries";
// import { setTime } from "@/helper/_helper";
// import { TFormData } from "@/types/inputTypes";
// import { Orders } from "@/types/ordersTypes";

// export async function make_log_report(
//   orderReport: EntriesTypes[],
//   formData: TFormData,
//   userId: string
// ) {
//   try {
//     const { date } = setTime();
//     const { clientName, destination, truck } = formData;
//     const orders: Orders = await prisma.reports.create({
//       data: {
//         clientName,
//         dateCreated: date,
//         usersId: userId,
//         destination,
//         truckName: truck,
//         orderedProducts: orderReport,
//         assignedProducts: {},
//       },
//       include: {
//         users: {
//           select: {
//             id: true,
//             username: true,
//           },
//         },
//       },
//     });

//     await update_product_status(orders);

//     return { orders };
//   } catch (error) {
//     return { error };
//   }
// }

// export async function update_product_status(orders: Orders | undefined) {
//   let updatedProducts;
//   try {
//     if (orders) {
//       for (let order of orders.orderedProducts) {
//         const bins = await prisma.bins.findMany({
//           where: {
//             id: {
//               in: order.binIdsEntries,
//             },
//           },
//           include: {
//             assignedProducts: {
//               where: {
//                 products: {
//                   barcodeId: order.barcodeId,
//                 },
//                 status: "Default",
//               },
//             },
//           },
//         });

//         const updatedProductIds = [];
//         for (let bin of bins) {
//           for (let assinedProduct of bin?.assignedProducts) {
//             if (order.totalQuantity > 0) {
//               updatedProductIds.push(assinedProduct?.id);
//               order.totalQuantity--;
//               // console.log(
//               //   "threshold",
//               //   order.totalQuantity,
//               //   "marked Assignment",
//               //   assinedProduct.status
//               // );
//             } else {
//               break;
//             }
//           }
//         }
//         console.log(updatedProductIds);

//         const truck = await prisma.trucks.findUnique({
//           where: {
//             name: String(orders.truckName),
//           },
//         });

//         const updatedData = await prisma.assignedProducts.updateMany({
//           where: {
//             id: {
//               in: updatedProductIds,
//             },
//           },
//           data: {
//             status: "Queuing",
//             truckName: {
//               set: truck?.name,
//             },
//           },
//         });

//         updatedProducts = updatedData;
//       }
//     }

//     return { updatedProducts };
//   } catch (error) {
//     return { error };
//   }
// }

// export async function getReport() {
//   try {
//     let reports = {};
//     const orders = await prisma.orders.findMany({
//       include: {
//         trucks: {
//           include: {
//             assignedProducts: true,
//           },
//         },
//         users: {
//           select: {
//             username: true,
//           },
//         },
//       },
//     });
//     console.log(orders);

//     /* I want to display also the assigned product that the bins has turne to load
//       for each order, I want to return all the orderedProducts

//     .*/

//     // for (let order of orders) {
//     //   console.log(order.dateCreated);
//     //   if (orders.length <= 0) {
//     //     break;
//     //   }

//     //   for (let orderedProduct of order.orderedProducts) {
//     //     const binIds = orderedProduct.binIdsEntries;

//     //     /* find all the bins using bin ids */
//     //     const bins = prisma.bins.findMany({
//     //       where: {
//     //         id: {
//     //           in: binIds,
//     //         },
//     //       },
//     //     });

//     //     console.log(bins);

//     //     /* I want to return the status of the assignedProducrts coming from the specific bins based on the total and data*/
//     //   }
//     // }

//     return { orders };
//   } catch (error) {
//     return { error };
//   }
// }

// export async function updateReport(orderId: string) {
//   try {
//     const orders = await prisma.orders.findUnique({
//       where: {
//         id: orderId,
//       },
//       include: {
//         trucks: true,
//       },
//     });

//     await prisma.trucks.update({
//       where: { name: orders?.trucks?.name },
//       data: { status: "Loaded" },
//     });

//     let updatedProducts;
//     try {
//       if (orders) {
//         for (let order of orders.orderedProducts) {
//           const bins = await prisma.bins.findMany({
//             where: {
//               id: {
//                 in: order.binIdsEntries,
//               },
//             },
//             include: {
//               assignedProducts: {
//                 where: {
//                   products: {
//                     barcodeId: order.barcodeId,
//                   },
//                   status: "Queuing",
//                 },
//               },
//             },
//           });

//           const assignedProductToUpdate = [];
//           for (let bin of bins) {
//             for (let assinedProduct of bin?.assignedProducts) {
//               if (order.totalQuantity > 0) {
//                 assignedProductToUpdate.push(assinedProduct?.id);
//                 order.totalQuantity--;
//               } else {
//                 break;
//               }
//             }
//           }
//           const udpatedData = await prisma.assignedProducts.updateMany({
//             where: {
//               id: {
//                 in: assignedProductToUpdate,
//               },
//             },
//             data: {
//               status: "Loaded",
//             },
//           });
//           updatedProducts = udpatedData;
//         }
//       }

//       return { updatedProducts };
//     } catch (error) {
//       return { error };
//     }
//   } catch (error) {
//     return { error };
//   }
// }
