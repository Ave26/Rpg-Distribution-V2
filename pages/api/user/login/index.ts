import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { createJwt, verifyJwt } from "@/lib/helper/jwt";
import { comparePassword } from "@/lib/helper/bcrypt";
import { createCookie } from "@/lib/helper/cookie";
import { findUser, findUserBasedOnId } from "@/lib/prisma/user";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("allow", ["POST", "DELETE", "GET"]);
  switch (req.method) {
    case "POST":
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(401).json({
          message: "Please complete credentials",
        });
      }
      try {
        const { user, error }: any = await findUser(username);
        console.log(error);
        if (!user) {
          return res.status(401).json({
            message: "Invalid Credentials",
          });
        }

        const { verifiedPwd } = await comparePassword(password, user.password);
        if (!verifiedPwd) {
          return res.status(404).json({
            message: "Invalid Credentials",
          });
        }

        // Remove the password field from the user object
        delete user.password;

        const token = createJwt(user);
        createCookie(token, res);
        console.log(user.password);
        return res.status(200).json({
          authenticated: true,
          message: "login succesfully",
          user: user,
        });
      } catch (e) {
        return res.status(500).json({
          message: "Internal server error " + e,
        });
      }

    default:
      res.status(405).json({ message: `Method '${req.method}' not allowed` });
      break;
  }
};

export default handler;
