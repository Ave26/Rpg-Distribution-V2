import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

// test
import { createJwt, verifyJwt } from "@/lib/helper/jwt";
import { comparePassword } from "@/lib/helper/bcrypt";
import { createCookie } from "@/lib/helper/cookie";
import { findUser, findUserBasedOnId } from "@/lib/prisma/user";

// const authenticate =
//   (handler: NextApiHandler) =>
//   async (req: NextApiRequest, res: NextApiResponse) => {
//     const { verifiedToken, error } = await verifyJwt(req);
//     if (verifiedToken) {
//       try {
//         const { user, error } = await findUserBasedOnId(verifiedToken.id);
//         if (error) {
//           return res.json(error);
//         }
//         return res.status(200).json({
//           authenticated: true,
//           data: user,
//         });
//       } catch (error) {
//         return res.send(error);
//       }
//     }

//     if (error) {
//       try {
//         return handler(req, res);
//       } catch (error) {
//         res.json(error);
//       }
//     } else {
//       return res
//         .status(405)
//         .json({ message: `Method '${req.method}' not allowed` });
//     }
//   };

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
        const { user }: any = await findUser(username);
        if (!user) {
          return res.status(401).json({
            message: "No Account Match",
          });
        }

        const { verifiedPwd } = await comparePassword(password, user.password);
        if (!verifiedPwd) {
          return res.status(404).json({
            message: "Password not match",
          });
        }

        // Remove the password field from the user object
        delete user.password;

        const token = createJwt(user);
        createCookie(token, res);
        console.log(user.password);
        return res.status(200).json({
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
