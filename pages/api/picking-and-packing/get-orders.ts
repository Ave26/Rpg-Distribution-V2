import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware, UserToken } from "../authMiddleware";
import prisma from "@/lib/prisma";
import { QuantityWBinID } from "@/components/picking-and-packing/TakeOrder";

// {
//   "_id": "68de98a065595ca9ff511c52",
//   "clientName": "YMCA",
//   "sales_order": "YMCA_FU",
//   "products": [
//     {
//       "skuCode": "SW-25S",
//       "count": 3
//     }
//   ]
// }

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
          assignedProducts: { distinct: "skuCode" },
        },
      })
      .catch((e) => console.log(e));

    const result = await prisma.order.aggregateRaw({
      pipeline: [
        {
          $lookup: {
            from: "trucks",
            localField: "truckId", // get the truck connection
            foreignField: "_id",
            as: "truck",
          },
        },
        { $unwind: { path: "$truck", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "assignedProducts", // get the product connection
            localField: "_id",
            foreignField: "orderId",
            as: "assignedProducts",
          },
        },

        { $unwind: "$assignedProducts" }, // become individual collection
        { $sort: { sales_order: 1 } },

        {
          $group: {
            _id: {
              orderId: "$_id",
              skuCode: "$assignedProducts.skuCode", // group the individual collection based on the orderId and skuCode
            },
            clientName: { $first: "$clientName" },
            salesOrder: { $first: "$sales_order" },
            truckName: { $first: "$truck.truckName" },
            count: { $sum: 1 },
          },
        },

        { $sort: { salesOrder: 1 } },
        {
          $group: {
            _id: "$_id.orderId",
            clientName: { $first: "$clientName" },
            salesOrder: { $first: "$sales_order" },
            truckName: { $first: "$truckName" },
            products: {
              $push: {
                skuCode: "$_id.skuCode",
                count: "$count",
              },
            },
          },
        },
        { $sort: { salesOrder: 1 } },
        // ✅ Sort the whole output here — this affects final documents

        // ✅ Sort inner array deterministically
        {
          $addFields: {
            products: {
              $sortArray: { input: "$products", sortBy: { skuCode: 1 } },
            },
          },
        },
        {
          $project: {
            orderId: { $toString: "$_id" },
            clientName: 1,
            salesOrder: 1,
            truckName: 1,
            products: 1,
            _id: 0,
          },
        },
      ],
    });
    console.log(JSON.stringify(result, null, 2));
    return res.json(result);
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
