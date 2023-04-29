import { createUser, findUser } from "@/lib/prisma/user";
import { NextApiRequest, NextApiResponse } from "next";

import { hashPassword } from "@/lib/helper/bcrypt";
import emailValidator from "email-validator";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Allow", ["POST", "GET"]);
  switch (req.method) {
    case "POST":
      // check if the request body is not empty
      const { username, password, additional_Info } = req.body;
      console.log(req.body, "this is from req");
      if (!username || !password) {
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
      const { user } = await findUser(username);

      if (user) {
        return res.status(409).json({
          message: "Account Already Exist",
        });
      }

      try {
        // encrypt password
        const hashedPwd = await hashPassword(password, 10);
        console.log(hashedPwd);

        const { newUser } = await createUser(
          username,
          hashedPwd,
          additional_Info
        );

        console.log(newUser);
        // if all requirements met, Account can be create
        return res.status(200).json({
          message: "Account Created",
          data: newUser,
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
