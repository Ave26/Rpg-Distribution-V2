import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import {
  getTrucks,
  getTruckStaffAccess,
  getTruckAdminAccess,
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
        if (verifiedToken && typeof verifiedToken === "object") {
          roles = verifiedToken.roles;
        }

        const roleMapping = {
          Admin: getTruckAdminAccess,
          SuperAdmin: getTruckAdminAccess,
          Staff: getTruckStaffAccess,
          Driver: getTruckAdminAccess,
        };

        const { error, trucks } = await roleMapping[roles as UserRole]();

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
