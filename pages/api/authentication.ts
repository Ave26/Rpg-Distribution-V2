import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default async function authentication(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { verifiedToken, error }: any = await verifyJwt(req);

    if (error) {
      return res.status(403).json({
        authenticated: false,
        message: error,
      });
    }
    return res.json({
      authenticated: true,
      verifiedToken,
    });
  } catch (error) {
    return res.send(error);
  }
}
