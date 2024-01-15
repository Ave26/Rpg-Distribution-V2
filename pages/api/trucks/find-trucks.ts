import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { trucks } from "@prisma/client";
import { getTruckAdminAccess, getTruckStaffAccess } from "@/lib/prisma/trucks";

type TRoles = "SuperAdmin" | "Admin" | "Staff" | "Driver";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  try {
    switch (req.method) {
      case "GET":
        let roles: TRoles = "SuperAdmin";
        if (verifiedToken && typeof verifiedToken === "object") {
          roles = verifiedToken.roles;
        }

        const roleMapping = {
          Admin: getTruckAdminAccess,
          SuperAdmin: getTruckAdminAccess,
          Staff: getTruckStaffAccess,
          Driver: getTruckAdminAccess,
        };
        const { trucks, error } = await roleMapping[roles as TRoles]();

        if (error) {
          return res.status(500).json({ message: "Server Error", error });
        }

        return res.status(200).json(trucks);
      default:
        return res.send(`Method ${req.method} is not allowed`);
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);

// console.log(roles);
// const roleMapping = {
//   SuperAdmin: () => console.log("do something"),
//   Admin: () => console.log("do something"),
// };

// const roleToMap = roleMapping[roles];
// let trucks;
// if (roles === "SuperAdmin" || roles === "Admin") {
//   console.log("admin executed");
//   trucks = await prisma.trucks.findMany({
//     where: {
//       status: "Available",
//     },
//     // include: {
//     //   records: {
//     //     select: {
//     //       id: true,
//     //       orderedProducts: {
//     //         where: {
//     //           assignedProducts: {
//     //             every: {
//     //               status: "Loaded",
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     // },
//     include: {
//       records: {
//         select: {
//           id: true,
//         },
//       },
//     },
//   });
// } else if (roles === "Staff") {
//   console.log("staff executed");
//   trucks = await prisma.trucks.findMany({
//     include: {
//       records: {
//         where: {
//           orderedProducts: {
//             some: {
//               assignedProducts: {
//                 some: {
//                   status: "Queuing",
//                 },
//               },
//             },
//           },
//         },
//         include: {
//           orderedProducts: {
//             include: {
//               assignedProducts: {
//                 where: {
//                   status: "Queuing",
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });
// }

// console.log(trucks);
