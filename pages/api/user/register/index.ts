import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import emailValidator from "email-validator";
import { createUser, findUser } from "@/lib/prisma/user";
import { hashPassword } from "@/lib/helper/bcrypt";
import { TUserWithConfirmPW } from "@/types/userTypes";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { user: userData }: { user: TUserWithConfirmPW } = req.body;
  console.log(userData);
  switch (req.method) {
    case "POST":
      if (!userData) {
        return res.status(401).json({ message: "Incomplete Field" });
      }

      if (userData.password !== userData.confirmPassword) {
        return res.status(405).json({ message: "Password not match" });
      }

      const validateEmail = emailValidator.validate(
        userData.additionalInfo.email
      );

      if (!validateEmail) {
        return res.status(400).json({
          message: "Your Email is not Valid",
        });
      }

      const { user } = await findUser(userData?.username);

      if (user) {
        return res.status(409).json({
          message: "Account Already Exist",
        });
      }
      const { password, role } = userData;
      const { dob, email } = userData.additionalInfo;
      const hashedPwd = await hashPassword(password, 10);
      const Phone_Number = parseInt(
        String(userData.additionalInfo?.Phone_Number)
      );

      const newAdditionalInfo = {
        dob,
        email,
        Phone_Number,
      };

      const { newUser, error } = await createUser(
        String(userData?.username),
        hashedPwd,
        role,
        newAdditionalInfo
      );

      if (error) {
        return res.status(500).json({
          message: "error from database" + error,
        });
      }
      console.log("User Created", newUser);
      return res.status(200).json({
        message: "Account Created",
        data: newUser,
      });

    default:
      return res.json({
        message: `${req.method} method is not allowed`,
      });
  }
}

export default authMiddleware(handler);
