import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../authMiddleware";
import prisma from "@/lib/prisma";
import { QuantityWBinID } from "@/components/picking-and-packing/TakeOrder";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  try {
    const orders = await prisma.order
      .findMany({
        omit: { grossWeight: true },
        include: {
          _count: { select: { assignedProducts: true } },
          locations: { select: { name: true } },
          trucks: { select: { truckName: true } },
        },
      })
      .catch((e) => console.log(e));
    console.log(orders);
    return res.json(orders);
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);

// Welcome to Node.js v22.16.0.
// for (const { binID, quantity } of limitsByBin) {
//   const v = await prisma.assignedProducts.findMany({
//     where: {
//       binId: binID,
//       status: "Default",
//       quality: "Good",
//       orderId: { isSet: false },
//     },
//     select: { id: true },
//     take: quantity,
//   });

//   ids = ids.concat(v.map((item) => item.id));
// }
// console.log(ids);

// first get the total number of products
// find the id of the product based on count for each bin

// const s = await prisma.order.findUnique({
//   where: { id: "68bb73d791db46b09bee3480" },
//   include: { assignedProducts: true },
// });

// console.log(s);
// const user = verifiedToken as UserToken;
// console.log(orderMap);

// console.log(limitsByBin);

// // const facet = Object.values(orderMap).map(());

// const facets = Object.fromEntries(
//   limitsByBin.map(({ binID, quantity }) => [
//     binID,
//     [
//       { $match: { binId: { $eq: { $oid: binID } } } },
//       { $limit: quantity },
//       { $project: { _id: 1 } },
//     ],
//   ])
// );

// console.log(facets);

// const productAggregation = await prisma.assignedProducts.aggregateRaw({
//   pipeline: [
//     { $facet: facets },
//     { $project: { kv: { $objectToArray: "$$ROOT" } } },
//     { $unwind: "$kv" },
//     { $unwind: "$kv.v" },
//     { $replaceRoot: { newRoot: "$kv.v" } },
//     { $project: { value: { $toString: "$_id" } } },
//     { $replaceRoot: { newRoot: "$value" } }, // replaces doc with the plain string
//   ],
// });
// // { $replaceRoot: { newRoot: "$ids" } },

// console.log(productAggregation);

// const ops = limitsByBin.map(({ binID, quantity }) => ({
//   updateMany: {
//     filter: { binId: { $oid: binID }, orderId: { $exists: false } }, // only free products
//     update: { $set: { orderId: "68bb73d791db46b09bee3480" } }, // connect to order
//     limit: quantity, // limit to count
//   },
// }));

// const t = await prisma.$runCommandRaw({
//   updateMany: {},
// });

// console.log(t);

// const ordr = await prisma.order.create({
//   data: {
//     batch: 1,
//     clientName: "",
//     sales_order: "",
//     status: "PENDING",
//     usersId: user.id,
//   },
// });

// const order = prisma.order.create({
//   data: {
//     batch: 1,
//     clientName: "",
//     sales_order: "",
//     status: "PENDING",
//     usersId: "",
//     createdAt: "",
//     initiator: {},
//     assignedProducts: {},
//   },
// });

/*  request: is to update the product for each bin limit to the number of products


  



  */
