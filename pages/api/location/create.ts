import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, UserToken } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { Coordinates, UserRole, locations } from "@prisma/client";

type TOmit = Omit<locations, "id" | "recordId" | "coordinates">;
type TLocation = TOmit & Coordinates;

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & UserToken
) {
  const { latitude, longitude, name }: TLocation = req.body;

  const hasValue = Object.values(req.body).every(Boolean);
  if (!hasValue) {
    return res.status(405).json({ hasValue });
  }

  try {
    if (req.method !== "POST") {
      return res
        .status(403)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
    const role = verifiedToken.roles;

    if (role === "Driver" || role === "Staff") {
      return res.status(405).json({ message: "Restricted" });
    }

    const locationFound = await prisma.locations.findUnique({
      where: { name },
    });

    if (locationFound) {
      return res.status(403).json({ message: "Location Already Exists" });
    }

    const location = await prisma.locations.create({
      data: {
        coordinates: {
          latitude,
          longitude,
        },
        name,
      },
    });

    return res.status(200).json(location);
  } catch (error) {
    console.error("Locations Handler Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default authMiddleware(handler);
