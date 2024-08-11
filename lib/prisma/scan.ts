import { assignedProducts, bins, Category } from "@prisma/client";
import prisma from ".";
import { TScanData } from "@/pages/dashboard/barcode-scanner";
import scan, { TScanDataFinal } from "@/pages/api/inbound/scan";

type TAssignedProducts = Omit<
  assignedProducts,
  | "id"
  | "dateReceive"
  | "binId"
  | "orderedProductsId"
  | "ordersId"
  | "truckName"
  | "productId"
  | "damageBinId"
  | "usersId"
>;

function setTime(value: Date) {
  let dateReceive = new Date();

  // Set the time component to zero
  dateReceive.setUTCHours(0);
  dateReceive.setUTCMinutes(0);
  dateReceive.setUTCSeconds(0);
  dateReceive.setUTCMilliseconds(0);

  // Format the date without time zone offset in local time
  dateReceive.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // const expiry = `${value}T00:00:00.000Z`;
  const expiry = new Date(
    value?.getFullYear(),
    value?.getMonth(),
    value?.getDate()
  );

  return { dateReceive, expiry };
}

// export async function scan_barcode(
//   assignedProduct: TAssignedProducts,
//   quantity: number,
//   usersId: string
// ) {
//   try {
//     let scanData: object | null = null;
//     const {
//       barcodeId,
//       boxSize,
//       expirationDate,
//       purchaseOrder,
//       quality,
//       skuCode,
//       status,
//     } = assignedProduct;

//     const productPromise = prisma.products.findUnique({
//       where: {
//         barcodeId,
//       },
//       select: {
//         category: true,
//       },
//     });

//     const categoryPromise = prisma.categories.findFirst({
//       where: {
//         category: (await productPromise)?.category,
//       },
//       select: {
//         id: true,
//       },
//     });

//     const binsPromise = prisma.bins.findMany({
//       where: {
//         racks: { categoriesId: (await categoryPromise)?.id },
//       },
//       include: {
//         racks: true,
//         _count: {
//           select: {
//             assignedProducts: { where: { status: "Default" || "Queuing" } },
//           },
//         },
//         assignedProducts: { select: { id: true } },
//       },
//     });

//     const [productResult, categories, bins] = await prisma.$transaction([
//       productPromise,
//       categoryPromise,
//       binsPromise,
//     ]);

//     let remainingQuantity = quantity;
//     console.log(remainingQuantity);

//     const { dateReceive, expiry } = setTime(
//       expirationDate ? expirationDate : new Date()
//     );

//     const binPromises = bins.map((bin) => {
//       return setMethod(
//         String(productResult?.category),
//         bin.id,
//         assignedProduct,
//         dateReceive
//       );
//     });

//     const availableBins = await Promise.all(binPromises);

//     for (let i = 0; i < bins.length; i++) {
//       const bin = bins[i];
//       const { availableBin } = availableBins[i];

//       if (quality === "Good") {
//         const newData: assignedProducts = {
//           // problem with the expiry
//           boxSize,
//           dateReceived,
//           purchaseOrder,
//           supplierName: "",
//           expirationDate: expiry,
//           status,
//           quality,
//           barcodeId,
//           skuCode,
//           binId: availableBin ? String(availableBin.id) : bin.id,
//           usersId,
//           id: "",
//           timeStamp: null,
//           version: 0,
//           damageBinId: null,
//           truckName: null,
//           ordersId: null,
//           binLocationsId: null,
//         };

//         if (availableBin) {
//           if (!quantity || quantity === 0) {
//             await prisma.assignedProducts.create({
//               data: newData,
//             });
//           } else {
//             const quantityToInsert = Math.min(
//               remainingQuantity,
//               bin.capacity - bin._count.assignedProducts
//             );

//             if (quantityToInsert > 0) {
//               const multipleAssignedProduct = Array.from(
//                 { length: quantityToInsert },
//                 () => newData
//               );

//               await prisma.assignedProducts.createMany({
//                 data: multipleAssignedProduct,
//               });

//               remainingQuantity -= quantityToInsert;
//             }
//           }

//           const TotalAssignedProduct = await prisma.assignedProducts.count({
//             where: {
//               binId: bin?.id,
//               status: "Default" || "Queuing",
//             },
//           });

//           const capacity = Number(bin?.capacity);
//           const binId = bin?.id;
//           const rackName = bin.racks?.name;

//           if (TotalAssignedProduct >= capacity) {
//             await prisma.bins.update({
//               where: {
//                 id: binId,
//               },
//               data: {
//                 isAvailable: false,
//               },
//             });
//           }

//           const row = availableBin?.row;
//           const shelfLevel = availableBin?.shelfLevel;
//           console.log(TotalAssignedProduct);
//           scanData = {
//             message: `Product Added ${TotalAssignedProduct}`,
//             quantity,
//             capacity,
//             row,
//             shelfLevel,
//             rackName,
//           };

//           if (bin.capacity >= TotalAssignedProduct) {
//             if (remainingQuantity <= 0) {
//               break; // Break if all products have been assigned
//             }
//           }
//         }
//       } else {
//         console.log("Goes to Damage Bin");
//         // Handle the case where quality is not "Good"
//         console.log("handle damage bin");
//       }
//     }

//     return { scanData };
//   } catch (error) {
//     return { error };
//   }
// }

// Update BinWithDate type to include assignedProducts with dateReceive and expiry
// type BinWithDate = bins & {
//   assignedProducts?: {
//     barcodeId: string;
//     skuCode: string;
//     expirationDate: Date;
//     dateReceive: Date; // Assuming dateReceive is part of assignedProducts
//   }[];
// };

// ...

// async function setMethod(
//   category: string,
//   binId: string,
//   assignedProduct: TAssignedProducts,
//   dateReceive: Date
// ) {
//   let availableBin: BinWithDate | null = null;

//   switch (category as Category) {
//     case "Food":
//     case "Cosmetics":
//       console.log("FEFO Method");
//       const { expiry } = setTime(assignedProduct.expirationDate);

//       availableBin = await prisma.bins.findFirst({
//         where: {
//           id: binId,
//           isAvailable: true,
//           assignedProducts: {
//             some: {
//               barcodeId: {
//                 equals: assignedProduct.barcodeId,
//               },
//               skuCode: {
//                 equals: assignedProduct.skuCode,
//               },
//               expirationDate: {
//                 equals: expiry,
//               },
//             },
//           },
//         },
//       });

//       break;
//     case "Laundry":
//     case "Sanitary":
//     case "Cleaning":
//       console.log("FIFO Method");

//       availableBin = await prisma.bins.findFirst({
//         where: {
//           id: binId,
//           isAvailable: true,
//           assignedProducts: {
//             some: {
//               barcodeId: {
//                 equals: assignedProduct.barcodeId,
//               },
//               skuCode: {
//                 equals: assignedProduct.skuCode,
//               },
//               dateReceive: {
//                 equals: dateReceive,
//               },
//             },
//           },
//         },
//       });
//       break;
//     default:
//       console.log("There is no available bin");
//       break;
//   }

//   console.log(availableBin);

//   return { availableBin };
// }

// export async function testScan_Barcode(scanData: TScanDataFinal) {
//   const { quantity, category, ...rest } = scanData;
//   const scannedData = rest; // this data can be stored in an array based on the quantity
//   let Message = "";

//   const Racks = await prisma.racks
//     .findMany({
//       where: { categories: { category } },
//       select: {
//         name: true,
//         id: true,
//         bins: {
//           // orderBy: { shelfLevel: "asc", row: "asc" },
//           where: { isAvailable: true },
//           orderBy: { row: "asc" },
//           include: { _count: { select: { assignedProducts: true } } },
//         },
//       },
//     })
//     .catch((e) => {
//       console.error(e);
//       return;
//     });
//   if (Racks instanceof Array) {
//     const bins = Racks.flatMap((v) => v.bins);
//   }
//   console.log(Racks);
//   // find the targeted bins that has access to

//   // await prisma.$transaction(async (tx) => {
//   //   for (bin of bins) {

//   //   }
//   // });

//   return;

//   const bins = Racks.flatMap((v) => v.bins);
//   const bin = bins.find((bin) => bin.isAvailable === true); // first available  bin

//   // console.log(bins);
//   // console.log(getRacks);

//   await prisma.$transaction(async (tx) => {
//     const liveCount = bin?._count.assignedProducts;

//     // const binTest = await prisma.bins.update({
//     //   where: {id: ""}, data: { version: { increment: 1 }, forUpdate: true }
//     // })

//     if (quantity < 1) {
//       console.log("Initiate Multiple Query");
//       Message = "Initiate Single Query";
//       const insertBatch = Array.from({ length: quantity }, () => scannedData);

//       const placeInBin = tx.bins.update({
//         where: {
//           id: bin?.id,
//           capacity: { gte: liveCount },
//           isAvailable: true,
//           version: bin?.version,
//         },
//         data: {
//           assignedProducts: { createMany: { data: insertBatch } },
//           version: { increment: 1 },
//         },
//       });
//     } else {
//       Message = "Initiate Single Query";
//       console.log("Initiate Single Query");
//     }
//   });

//   return { ewan: Message };
// }
// export async function testScan_Barcode(scanData: TScanDataFinal) {
//   await prisma
//     .$transaction(async (prisma) => {
//       // one request if error rollback
//       const { quantity, category, ...rest } = scanData;
//       const scannedProduct = rest;

//       const product = await prisma.stockKeepingUnit.findUnique({
//         where: { code: scannedProduct.skuCode },
//         select: { threshold: true },
//       });

//       // based on the threshold of the product, it needs to find the exact bins it needed
//       // const productThreshold = 2000; // dynamic
//       console.log(product);
//       const quadBinsSize = 320; // static
//       const numberOfBins = 4; // static

//       const numberOfBinsToFetch = product
//         ? (product?.threshold / quadBinsSize) * numberOfBins
//         : undefined;
//       // minimize the count of bins based on the threshold of the product needed
//       // the bins capacity need to be check

//       const bins = await prisma.bins.findMany({
//         where: {
//           racks: { categories: { category } },
//         },
//         include: {
//           racks: { select: { categories: { select: { category: true } } } },
//         },
//         take: numberOfBinsToFetch,
//       });

//       const capacityHolder = bins.reduce((acc, initial) => {
//         const result = acc + initial.capacity;
//         return result;
//       }, 0);

//       console.log(bins);
//       console.log({ result: capacityHolder });
//       return;
//       //  find the bins where the product threshold can handle
//       //  based on sku threshold is equal to 2000
//       // precalculated: capacity 320 for each every 4 bins * 7 bins = 2240 product threshold

//       //  100, 100, 70, 50
//       //   0    1    2   3 shelf
//     })

//     .catch((e) => console.error(e));
// }

export async function addItemsToBins(scanData: TScanDataFinal) {
  // const bins = await prisma.bins.findMany();
  // for (const bin of bins) {
  //   await testScan_Barcode(scanData, bin.id);
  // }
}

/* PLAN
  - SEARCH ONLY THE BINS THAT IS LESS THAN THE QUANTITY THE HAS BEEN INPUTED BASED ON THE BIN'S CAPACITY - PUT THE WORK INTO CLIENT SIDE.
    eg.
    count = 10 
    await bins.capacity = 3600
    if count > bin.capacity then await one or more bins
    otherwise get the id of the single awaited bins

    debunk
    there will be a stale data
    because of multi user involve

  Question: How can I handle stale data with just using REST
  The only thing that can be guaranteed is Versioning or Optimistic Concurrent


  - IMPLEMENT OPTIMISTIC CONCURRENT CONTROL BY INCLUDING VERSION FIELDS IN YOUR DOCUMENTS

    e.g
    const bin = await prisma.bins.find({
      where: { id: bin.id }, select: { version: true }
    })

    const bins = await prisma.bins.update({
      where: { version: bin.version, capacity: { gte: bin.count } }, 
      data: { version: { increment: 1 }, assignedProduct.create }
    })

    if 2 users requesting at the same time what will happen if we have Versioning?

    User A’s update succeeds because the version matches.
    User B’s update fails because the version has changed due to User A’s update.
    User B is informed that the update failed and can take appropriate action, such as refreshing the data and retrying the update.

    what if I dont want the versioning I just want to check wheather the capacity
    can still hold if not then go to another bin and if 2 users requested at the same
    time then the bin might go overload and bypass the capacity cause one of the users
    have stale data.

    I have a document that is connected to another document in a one to many relationship, which is bin and assignedProduct

    My question is, can I direclty just add the count but not the assignedProduct

    e.g
      Instead of using this
       const placeInBin = tx.bins.update({
        where: {
          id: bin?.id,
          capacity: { gte: liveCount },
          isAvailable: true,
          version: bin?.version,
        },
        data: {
          assignedProducts: { createMany: { data: insertBatch } },
          version: { increment: 1 },
        },
      });

      just use this
       const placeInBin = tx.bins.update({
        where: {
          id: bin?.id,
          capacity: { gte: liveCount },
          isAvailable: true,
          version: bin?.version,
        },
        data: {
          assignedProducts: { count: 100 }
      }); 


      Answer: Adding a custom field is a much straight forward solution


      if I want to quantify my document do I need to create the info again and again
      eg. 
        assignedProduct = {
        name: ""
        version: ""
        kind: ""
        timestamped: new Date()
        }

        if not do I need to add the count so that it will only create if the assingedProduct info is different or the timeStamp is different

        count: 10


      what if in a for loop everytime I push something in an array
      it will check the bin if its full asyncronously

      eg. 

      function checkBins () {
        const checkBins = await prisma.bins.find({
          where: { isAvailable: true }, select: { _count: true }
          })
         return checkBins 
      }
          

      const quantity = 10
      const product = { name: "canned tuna",  type: "food"}
          for (bin of bins) {
            Array.from({ length: quantity }, ()=> product)
          }

*/
