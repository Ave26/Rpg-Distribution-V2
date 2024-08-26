// import { NextApiRequest, NextApiResponse } from "next";
// import { authMiddleware } from "../authMiddleware";
// import { JwtPayload } from "jsonwebtoken";
// import { DamageBin } from "@/components/PalleteLocation/DamageBin";
// import prisma from "@/lib/prisma";
// import { Prisma } from "@prisma/client";

// export async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   verifiedToken: string | JwtPayload | undefined
// ) {
//   const data: DamageBin = req.body;
//   console.log(data);
//   return;

//   try {
//     if (!Object.values(rest).every(Boolean) || rest.category === "Default") {
//       return res.json({ message: "Incomplete Field" });
//     }

//     // Retrieve the current highest section value
//     const maxSectionBin = await prisma.damageBins.findFirst({
//       where: { category: rest.category },
//       orderBy: {
//         section: "desc",
//       },
//     });

//     // Determine the starting section value for the new bins
//     let nextSection = maxSectionBin ? maxSectionBin.section + 1 : 1;

//     const damageBins = Array.from({ length: binQuantity }, () => {
//       const bin: Prisma.damageBinsCreateManyInput = {
//         ...rest,
//         section: nextSection++,
//         category: rest.category as DamageCategory, // Explicitly cast or ensure the correct type here
//       };
//       return bin;
//     });

//     const createBin = await prisma.damageBins.createMany({
//       data: damageBins,
//     });
//     return res.json(createBin);
//   } catch (error) {
//     console.error(error);
//     return res.status(404).json(error);
//   }
// }

// export default authMiddleware(handler);
