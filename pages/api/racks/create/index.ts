import { verifyJwt } from "@/lib/helper/jwt";
import { createRack } from "@/lib/prisma/racks";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const middleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("middleware working properly");
    try {
      const { verifiedToken, error }: any = await verifyJwt(req);

      if (error) {
        return res.status(403).json({
          authenticated: false,
          message: error,
        });
      }

      if (verifiedToken) {
        return handler(req, res);
      }
    } catch (error) {
      return res.send(error);
    }
  };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { category, section } = req.body;

  if (!category || !section) {
    return res.status(405).json({
      message: "Filled Incomplete",
    });
  }

  switch (req.method) {
    case "POST":
      try {
        const { rack, error, rackFound } = await createRack(category, section);

        if (rackFound) {
          return res
            .status(302)
            .json({ message: "Rack Already Created", rackFound });
        }
        return rack
          ? res.status(200).json({
              message: "Added Succesfully",
              rack,
            })
          : res.json(error);
      } catch (error) {
        return res.json(error);
      }

    case "PATCH":

    default:
      return res.send(`Method ${req.method} is not available`);
  }
};

export default middleware(handler);
