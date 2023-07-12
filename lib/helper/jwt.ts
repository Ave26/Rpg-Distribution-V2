import { sign, verify, decode, JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const createJwt = (user: any) => {
  const { id, roles } = user;
  const token = sign({ id, roles }, String(process.env.JWT_SECRET), {
    expiresIn: "5h",
  });
  return token;
};

export const verifyJwt = async (req: NextApiRequest | undefined) => {
  const token: any = req?.cookies.token;
  console.log(`Token: ${token}`);

  try {
    const verifiedToken: any = verify(token, String(process.env.JWT_SECRET));
    return { verifiedToken };
  } catch (error) {
    return { error };
  }
};
