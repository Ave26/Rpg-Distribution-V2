import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import {
  getTruckStaffAccess,
  getTruckAdminAccess,
  getTruckDriverAccess,
} from "@/lib/prisma/trucks";
// import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  try {
    switch (req.method) {
      case "GET":
        // let roles: UserRole = "SuperAdmin";
        // let userId: string;
        let role = verifiedToken.role;
        console.log(role);
        let userId = verifiedToken.id;
        const status = "";
        const roleMapping: Record<string, () => any> = {
          SUPERADMIN: getTruckAdminAccess,
          ADMIN: getTruckAdminAccess,
          STAFF: getTruckStaffAccess,
          DRIVER: () => getTruckDriverAccess(userId, status),
        };

        const { error, trucks } = await roleMapping[role]();
        console.log(trucks);
        return error
          ? res.status(500).json({ message: "Server Error", error })
          : res.status(200).json(trucks);

      default:
        return res.send(`Method ${req.method} is not allowed`);
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
