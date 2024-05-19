// import { NextApiRequest, NextApiResponse } from "next";
// import { authMiddleware } from "../authMiddleware";
// import { EntriesTypes } from "@/types/binEntries";
// import { JwtPayload } from "jsonwebtoken";
// import { TFormData } from "@/types/inputTypes";
// import { create_order } from "@/lib/prisma/order";
// import { UserRole } from "@prisma/client";

// type TBody = {
//   productEntry: EntriesTypes[];
//   formData: TFormData;
// };

// export async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   verifiedToken: JwtPayload & { roles: UserRole; id: string }
// ) {
//   const { productEntry, formData }: TBody = req.body;

//   console.log(productEntry, formData);
//   switch (req.method) {
//     case "POST":
//       try {
//         if (productEntry.length <= 0 || !formData) {
//           return res.status(401).json({
//             message: "Incomplete Field",
//           });
//         }
//         const userId: string = verifiedToken.id;

//         const { error, record } = await create_order(
//           productEntry,
//           formData,
//           userId
//         );

//         if (error) {
//           return res.status(500).json({ error, message: "Unknown Error" });
//         }

//         console.log(error);

//         return res.json({ record, message: "Order Created" });
//       } catch (error) {
//         return console.log(error);
//       }

//     case "GET":
//       try {
//         return res.send("Make order Api is working ;)");
//       } catch (error) {
//         return console.log(error);
//       }
//     default:
//       break;
//   }
// }

// export default authMiddleware(handler);
