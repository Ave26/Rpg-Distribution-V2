// import { NextApiRequest, NextApiResponse } from "next";
// import { authMiddleware } from "../authMiddleware";
// import { EntriesTypes } from "@/types/binEntries";
// import { JwtPayload } from "jsonwebtoken";

// import { TFormData } from "@/types/inputTypes";
// import { get_order } from "@/lib/prisma/order";

// type TBody = {
//   productEntry: EntriesTypes[];
//   formData: TFormData;
// };

// export async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   verifiedToken: string | JwtPayload | undefined
// ) {
//   switch (req.method) {
//     case "GET":
//       try {
//         const { orders, error } = await get_order();

//         return !orders || error
//           ? res.status(404).json({
//               message: error,
//             })
//           : res.status(200).json(orders);
//       } catch (error) {
//         return console.log(error);
//       }
//     default:
//       break;
//   }
// }

// export default authMiddleware(handler);
