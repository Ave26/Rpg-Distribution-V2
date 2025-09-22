import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../authMiddleware";
import prisma from "@/lib/prisma";
import { QuantityWBinID } from "@/components/picking-and-packing/TakeOrder";
import { concat } from "lodash";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const orderMap: QuantityWBinID = req.body;
  const limitsByBin = Object.values(orderMap).flatMap((v) =>
    Object.entries(v).map(([key, count]) => ({ binID: key, quantity: count }))
  );

  await prisma
    .$transaction(async (tx) => {
      let sales_order = "test";

      const takeLast = await tx.order.findFirst({
        where: { sales_order },
        select: { batch: true },
        orderBy: { batch: "desc" },
        take: 1,
      });

      const order = await tx.order.create({
        data: {
          batch: takeLast?.batch ? takeLast?.batch + 1 : 1,
          clientName: "",
          sales_order,
          status: "PENDING",
          initiator: { connect: { id: verifiedToken.id } },
        },
        select: { id: true },
      });

      let ids: string[] = [];

      for (const { binID, quantity } of limitsByBin) {
        const val = await tx.assignedProducts.findMany({
          where: {
            binId: binID,
            orderId: { isSet: false },
            status: "Default",
            quality: "Good",
          },
          take: quantity,
          select: { id: true },
        });

        ids.push(...val.map((v) => v.id));
      }
      if (ids.length > 0) {
        await tx.assignedProducts.updateMany({
          where: { id: { in: ids } },
          data: { orderId: order.id },
        });
      }
    })
    .then((tx) => {
      return res.json({ message: "Success", tx });
    })
    .catch((e) => {
      return res.json({ message: "Failed", e });
    });
}

export default authMiddleware(handler);
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
