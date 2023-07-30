// import { verifyJwt } from "@/lib/helper/jwt";
// import { findUserBasedOnId } from "@/lib/prisma/user";
// import { NextApiRequest, NextApiResponse } from "next";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { verifiedToken, error } = await verifyJwt(req);

//   if (error) {
//     return res.status(401).json({
//       authenticated: false,
//       error,
//     });
//   }

//   if (verifiedToken) {
//     try {
//       const { user, error } = await findUserBasedOnId(verifiedToken);
//       if (error) {
//         return res.send(error);
//       }
//       return res.status(200).json({
//         authenticated: true,
//         data: user,
//       });
//     } catch (error) {
//       return res.json({ message: "catch error", error });
//     }
//   }
// };

// export default handler;
