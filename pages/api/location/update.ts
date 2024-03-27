import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { Coordinates, UserRole, locations } from "@prisma/client";
import { TOmitLocation } from "@/components/DeliveryMangement/Location/locationTypes";

type TOmit = Omit<locations, "id" | "recordId" | "coordinates">;
type TLocation = TOmit & Coordinates;

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: JwtPayload & { roles: UserRole; id: string }
) {
  const { latitude, longitude, name }: TLocation = req.body;

  const hasSomeValue = Object.values(req.body).some(Boolean);
  //   if (!hasValue) {
  //     return res.status(405).json({ hasValue });
  //   }

  try {
    if (req.method !== "PATCH") {
      return res
        .status(403)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
    const role = verifiedToken.roles;

    if (role === "Driver" || role === "Staff") {
      return res.status(405).json({ message: "Restricted" });
    }

    const data: TOmitLocation = {
      coordinates: {
        latitude,
        longitude,
      },
      name,
    };
    const filteredData: Record<string, number | string> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        if (typeof value === "number" || typeof value === "string") {
          filteredData[key] = value;
        }
      }
    });
    console.log(filteredData);
    const location = await prisma.locations.update({
      where: { name },
      data: {},
    });

    return res.status(200).json(location);
  } catch (error) {
    console.error("Locations Handler Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default authMiddleware(handler);

// WIP
