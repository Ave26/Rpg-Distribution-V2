import { deleteCookie } from "@/lib/helper/cookie";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    try {
      deleteCookie(res);
      return res.json({
        message: "Logout Succesfully",
      });
    } catch (error) {
      return res.send(error);
    }
  }
};

export default handler;
