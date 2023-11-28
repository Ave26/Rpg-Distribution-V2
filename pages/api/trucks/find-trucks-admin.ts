import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { trucks } from "@prisma/client";
type TRoles = "SuperAdmin" | "Admin" | undefined;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  try {
    switch (req.method) {
      case "GET":
        let roles: TRoles = undefined;
        if (verifiedToken && typeof verifiedToken === "object") {
          roles = verifiedToken.roles;
        }

        let trucks;
        if (roles === "SuperAdmin" || "Admin") {
          trucks = await prisma.trucks.findMany({
            // where: {
            //   capacity: 2000,
            // },
            // include: {
            //   records: {
            //     select: {
            //       id: true,
            //       orderedProducts: {
            //         where: {
            //           assignedProducts: {
            //             every: {
            //               status: "Loaded",
            //             },
            //           },
            //         },
            //       },
            //     },
            //   },
            // },
            include: {
              records: {
                where: {
                  orderedProducts: {
                    some: {
                      assignedProducts: {
                        every: {
                          status: "Loaded",
                        },
                      },
                    },
                  },
                },
                include: {
                  orderedProducts: {
                    include: {
                      assignedProducts: true,
                    },
                  },
                },
              },
            },
          });
        }
        let bins;
        if (trucks) {
          for (let truck of trucks) {
            for (let record of truck.records) {
              for (let orderedProduct of record.orderedProducts) {
                const binEntries = orderedProduct.binIdsEntries;
                bins = await prisma.bins.findMany({
                  where: {
                    id: {
                      in: binEntries,
                    },
                  },
                });
              }
            }
          }
        }
        console.log(bins);
        return res.status(200).json({ trucks, bins });

      default:
        return res.send(`Method ${req.method} is not allowed`);
    }
  } catch (error) {
    return res.json(error);
  }
}

export default authMiddleware(handler);
