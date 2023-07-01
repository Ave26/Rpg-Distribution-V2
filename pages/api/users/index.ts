import { findAllUsers } from "@/lib/prisma/user";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Allow", ["POST", "GET"]);
  switch (req.method) {
    case "GET":
      try {
        const { users, error } = await findAllUsers();
        return error ? res.json(error) : res.status(200).json(users);
      } catch (error) {
        return res.json(error);
      }
    default:
      res.json({
        message: `${req.method} method is not allowed`,
      });
  }
};

export default handler;
