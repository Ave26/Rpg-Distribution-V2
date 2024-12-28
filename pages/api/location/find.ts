import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
// import { UserRole } from "@prisma/client";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  try {
    const role = verifiedToken.roles;

    if (role === "Driver" || role === "Staff") {
      return res.status(405).json({ message: "Restricted" });
    }

    if (req.method !== "GET") {
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
    const locations = await prisma.locations.findMany({});
    return res.status(200).json(locations);
  } catch (error) {
    console.error("Locations Handler Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default authMiddleware(handler);
