import { sign, verify, decode, JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { VerifyToken } from "@/types/authTypes";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";

interface Token {
  id: string;
  roles: string;
  iat: number;
  exp: number;
}

interface UserTypes {
  id: string;
  roles: string;
}

export const createJwt = (user: UserTypes | null | undefined) => {
  if (user) {
    const { id, roles } = user;
    const token = sign({ id, roles }, String(process.env.JWT_SECRET), {
      expiresIn: "12h",
    });
    return token;
  }
};

export const verifyJwt = async (req: NextApiRequest) => {
  const token: string | undefined = req?.cookies?.token;
  // console.log(`Token: ${token}`);

  try {
    const verifiedToken = verify(String(token), String(process.env.JWT_SECRET));

    return { verifiedToken };
  } catch (error) {
    return { error };
  }
};
