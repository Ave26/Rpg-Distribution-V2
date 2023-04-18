import { createUser, findUser } from "@/lib/prisma/user";
import { NextApiRequest, NextApiResponse } from "next";

import { hashPassword } from "@/lib/helper/bcrypt";
import emailValidator from "email-validator";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Allow", ["POST", "GET"]);
  switch (req.method) {
    case "POST":
      // check if the request body is not empty
      const { username, password, roles, additional_Info } = req.body;
      if (!username || !password || !roles || !additional_Info) {
        return res.status(401).json({
          message: "Please Complete Credentials",
        });
      }
      //  check if exist for additional info object
      const isEmpty = Object.values(additional_Info).some((value) => !value);

      if (isEmpty) {
        return res.status(401).json({
          message: "Please fill in all additional information",
        });
      }

      // check if email is valid
      const validateEmail = emailValidator.validate(additional_Info.email);

      if (!validateEmail) {
        return res.status(400).json({
          message: "Your Email is not Valid",
        });
      }

      // check if user is existed in db
      const { userExists } = await findUser(username);

      if (userExists) {
        res.status(409).json({
          message: "Account Already Exist",
        });
      }

      try {
        // encrypt password
        const hashedPwd = await hashPassword(password, 10);
        console.log(hashedPwd);
        const { newUser, error } = await createUser(
          username,
          hashedPwd,
          roles,
          additional_Info
        );

        // if all requirements met, Account can be create
        return res.status(200).json({
          message: "Account Created",
          // data: newUser,
        });
      } catch (e) {
        return res.status(400).json({
          message: e,
        });
      }

    default:
      res.json({
        message: `${req.method} method is not allowed`,
      });
  }
};

export default handler;
