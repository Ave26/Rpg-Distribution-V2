// import { NextApiRequest, NextApiResponse } from "next";
// import { updateSelectedBin } from "@/lib/prisma/bin";
// import { authMiddleware } from "../authMiddleware";

// type TRequest = {
//   barcodeId: string;
//   productName: string;
// };

// export async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { barcodeId, productName }: TRequest = req.body;
//   // if (!barcodeId) {
//   //   const { binThatHasCount: bins, error } = await findAllBin();

//   //   if (!bins || error) {
//   //     return res.status(500).json({
//   //       message: "Oops! something went wrong" + error,
//   //     });
//   //   }

//   //   return res.status(200).json(bins);
//   // } else {
//   //   const { binThatHasCount: bins, error } = await findBinByBarcode(barcodeId);

//   //   if (!bins || error) {
//   //     return res.status(500).json({
//   //       message: "Oops! something went wrong" + error,
//   //     });
//   //   }
//   //   return res.status(200).json(bins);
//   // }

//   switch (req.method) {
//     case "POST":
//       if (!barcodeId || !productName)
//         return res.status(500).json({ message: "Undefined Search Field" });

//     case "GET":
//       const { binThatHasCount: bins, error } = await findAllBin();

//       return !bins || error
//         ? res.status(500).json({ error, message: "Oops, something went wrong" })
//         : res.status(500).json(bins);

//     default:
//       break;
//   }
// }

// export default authMiddleware(handler);
