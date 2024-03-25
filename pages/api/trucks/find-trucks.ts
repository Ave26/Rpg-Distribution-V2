import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import {
  getTrucks,
  getTruckStaffAccess,
  getTruckAdminAccess,
  getTruckDriverAccess,
} from "@/lib/prisma/trucks";
import { UserRole } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  try {
    switch (req.method) {
      case "GET":
        let roles: UserRole = "SuperAdmin";
        let userId: string;
        if (verifiedToken && typeof verifiedToken === "object") {
          roles = verifiedToken.roles;
          userId = verifiedToken.id;
        }

        const roleMapping = {
          Admin: getTruckAdminAccess,
          SuperAdmin: getTruckAdminAccess,
          Staff: getTruckStaffAccess,
          Driver: () => getTruckDriverAccess(userId),
        };

        const { error, trucks } = await roleMapping[roles as UserRole]();

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
