import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createJwt, verifyJwt } from "@/lib/helper/jwt";
import { comparePassword } from "@/lib/helper/bcrypt";
import { createCookie } from "@/lib/helper/cookie";
import { users as TUser } from "@prisma/client";
import {
  findUser,
  findUserBasedOnId,
  findUserFilterPassword,
} from "@/lib/prisma/user";

type TOmitUser = Omit<TUser, "id" | "additional_Info">;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("allow", ["POST", "DELETE", "GET"]);
  switch (req.method) {
    case "POST":
      const { auth } = req.body;
      const { username, password }: TOmitUser = auth;
      if (!username || !password) {
        return res.status(401).json({
          message: "Please complete credentials",
        });
      }
      try {
        const { user } = await findUser(username);
        console.log("User", user);

        if (!user) {
          return res.status(401).json({
            message: "Invalid Credentials",
          });
        }

        const { verifiedPwd } = await comparePassword(
          password,
          String(user?.password)
        );
        if (!verifiedPwd) {
          return res.status(404).json({
            message: "Invalid Credentials",
          });
        }

        // Remove the password field from the user object
        // delete user.password;
        const { filteredUser } = await findUserFilterPassword(
          String(user.username)
        );

        const token = createJwt(filteredUser);
        createCookie(token, res);

        const userData = {
          authenticated: true,
          message: "login succesfully",
          user: filteredUser,
        };

        return res.status(200).json(userData);
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
