import { deleteCookie } from "@/lib/helper/cookie";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Logging out...");
  if (req.method === "DELETE") {
    try {
      deleteCookie(res);
      console.log("Logout Succesfull");
      return res.json({
        message: "Logout Succesfully",
      });
    } catch (error) {
      return res.send(error);
    }
  }
};

export default authMiddleware(handler);
