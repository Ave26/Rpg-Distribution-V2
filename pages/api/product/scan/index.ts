// import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
// import { verifyJwt } from "@/lib/helper/jwt";
// import { scanBarcode } from "@/lib/prisma/scan";
// import prisma from "@/lib/prisma";

// const middleware =
//   (handler: NextApiHandler) =>
//   async (req: NextApiRequest, res: NextApiResponse) => {
//     try {
//       const { verifiedToken, error }: any = await verifyJwt(req);
//       console.log(verifiedToken?.id);
//       if (error) {
//         return res.status(403).json({
//           isAuthenticated: false,
//           message: "Failed To Authenticate",
//         });
//       }

//       if (verifiedToken) {
//         return handler(req, res);
//       }
//     } catch (error) {
//       return res.send(error);
//     }
//   };

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const {
//     barcodeId,
//     purchaseOrder,
//     boxSize,
//     expirationDate,
//     quality,
//     quantity,
//     // binId,
//   } = req.body;

//   if (
//     !barcodeId ||
//     !purchaseOrder ||
//     !boxSize ||
//     !expirationDate ||
//     !quality
//     // !binId
//   ) {
//     return res.status(405).json({
//       message: "Incomplete Field",
//     });
//   }

//   console.log(req.body);

//   switch (req.method) {
//     case "POST":
//       try {
//         const data = await scanBarcode(
//           barcodeId,
//           purchaseOrder,
//           boxSize,
//           new Date(expirationDate),
//           quality,
//           quantity
//         );

//         if (!data) {
//           return res.status(404).json({
//             message: "Oops!, Category not found",
//           });
//         }

//         return res.status(200).json(data);
//       } catch (error) {
//         return res.json(error);
//       }

//     case "GET":
//       try {
//       } catch (error) {
//         return res.json(error);
//       }

//     default:
//       console.log(`Method ${req.method} is not allowed`);

//       break;
//   }
// };

// export default middleware(handler);
