// import { NextApiRequest, NextApiResponse } from "next";
// import { authMiddleware } from "../authMiddleware";
// import { EntriesTypes } from "@/types/binEntries";
// import { JwtPayload } from "jsonwebtoken";

// import { TFormData } from "@/types/inputTypes";
// import { get_order } from "@/lib/prisma/order";
// import prisma from "@/lib/prisma";

// type TRecordId = {
//   id: string;
// };

// export async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   verifiedToken: string | JwtPayload | undefined
// ) {
//   const { recordsId } = req.body;
//   const idString: string[] = recordsId.map((record: TRecordId) => record.id);
//   switch (req.method) {
//     case "POST":
//       try {
//         const records = await prisma.records.findMany({
//           where: {
//             id: {
//               in: idString,
//             },
//             orderedProducts: {
//               every: {
//                 assignedProducts: {
//                   every: {
//                     status: "Loaded",
//                   },
//                 },
//               },
//             },
//           },

//           select: {
//             id: true,
//             truckName: true,
//             clientName: true,
//             authorName: true,
//             dateCreated: true,

//             orderedProducts: {
//               select: {
//                 id: true,
//                 totalQuantity: true,
//                 assignedProducts: true,
//                 products: {
//                   select: {
//                     productName: true,
//                   },
//                 },
//               },
//             },
//           },
//         });

//         return res.status(200).json(records);
//       } catch (error) {
//         return console.log(error);
//       }
//     default:
//       break;
//   }
// }

// export default authMiddleware(handler);
