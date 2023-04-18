import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Allow", ["POST", "GET"]);
  switch (req.method) {
    case "GET":
      res.send("this is get");
    case "POST":
      
    default:
      res.json({
        message: `${req.method} method is not allowed`,
      });
  }
};

export default handler;
