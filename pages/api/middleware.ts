import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default async function middleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { verifiedToken, error }: any = await verifyJwt(req);
      if (error) {
        return res.status(403).json({
          authenticated: false,
          message: error,
        });
      }
      if (verifiedToken.roles === "Admin") {
        console.log(verifiedToken);
        console.log("register");

        return handler(req, res);
      } else {
        return res.status(500).json({
          Authorized: false,
          message: "Forbidden",
        });
      }
    } catch (error) {
      return res.send(error);
    }
  };
}
