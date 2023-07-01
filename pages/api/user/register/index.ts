import { createUser, findUser } from "@/lib/prisma/user";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/helper/bcrypt";
import emailValidator from "email-validator";
import { verifyJwt } from "@/lib/helper/jwt";
import { HiCalculator } from "react-icons/hi";

const middleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Allow", ["POST", "GET"]);
  switch (req.method) {
    case "POST":
      // check if the request body is not empty
      const { username, password, additional_Info } = req.body;
      // console.log(req.body);
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

        // convert Phone_Number to an integer
        const { Dob, email } = additional_Info;
        const Phone_Number = parseInt(additional_Info.Phone_Number);

        const { newUser, error } = await createUser(username, hashedPwd, {
          Dob,
          email,
          Phone_Number,
        });

        console.log(newUser);
        // if all requirements met, Account can be create

        if (error) {
          return res.status(500).json({
            message: "error from database" + error,
          });
        }

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

export default middleware(handler);
