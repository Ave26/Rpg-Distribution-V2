import { verifyJwt } from "@/lib/helper/jwt";
// import { setUpRack } from "@/lib/prisma/racks";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { rackCategory, rackName, numberOfBins, shelfLevel } = req.body;

  if (!rackCategory || !rackName || !numberOfBins || !shelfLevel) {
    return res.status(405).json({
      message: "Field Incomplete",
    });
  }

  switch (req.method) {
    case "POST":
      try {
        // const newBin = await setUpRack(
        //   rackCategory,
        //   rackName,
        //   Number(numberOfBins),
        //   Number(shelfLevel)
        // );
        // if (!newBin) {
        //   return res.status(500).json({
        //     message: "Oops! something went wrong",
        //   });
        // }
        // return res.json(newBin);
      } catch (error) {
        console.log(error);
      }

    case "PATCH":

    default:
      return res.send(`Method ${req.method} is not available`);
  }
};

export default authMiddleware(handler);
