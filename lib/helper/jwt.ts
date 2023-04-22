import { sign, verify, decode, JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface Payload {
  id: string;
  roles: string[];
}

export const createJwt = (user: any) => {
  const { id, roles } = user;
  const token = sign({ id, roles }, String(process.env.JWT_SECRET), {
    expiresIn: "5h",
  });
  return token;
};

export const verifyJwt = async (req: NextApiRequest) => {
  const token: any = req.cookies.token;
  console.log(token + "this ois fom jwt");
  try {
    const verifiedToken: any = verify(token, String(process.env.JWT_SECRET));
    return { verifiedToken };
  } catch (error) {
    return { error };
  }
};
