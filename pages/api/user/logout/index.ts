import { deleteCookie } from "@/lib/helper/cookie";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../authMiddleware";
import { AuthProps } from "@/types/authTypes";

export interface LogoutResponse {
  message: string;
  isLogout: boolean;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Logging out...");
  if (req.method === "DELETE") {
    try {
      deleteCookie(res);
      console.log("Logout Succesfull");

      const data: AuthProps = {
        authenticated: false,
        verifiedToken: { role: "", id: "" },
      };

      return res.json({
        message: "Logout Succesfully",
        isLogout: true,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        message: "You are not login!",
        isLogout: false,
      });
    }
  }
};

export default authMiddleware(handler);
