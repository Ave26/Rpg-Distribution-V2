import { sign, verify, decode } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { VerifyToken } from "@/types/authTypes";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";
import { users } from "@prisma/client";

interface Token {
  id: string;
  roles: string;
  iat: number;
  exp: number;
}

interface JwtPayload {
  roles: string;
  username: string;
  iat: number;
  exp: number;
  // Add other properties if needed
}

// type TUser = Omit<users, "password" | "username" | "additionalInfo">;
type TUser = Pick<users, "id" | "role">;
// interface UserTypes {
//   id: string;
//   roles: "";
// }
// const { id, roles } = user;

export const createJwt = (user: TUser) => {
  // | null | undefined
  if (user) {
    const token = sign(user, process.env.JWT_SECRET as string, {
      expiresIn: "12h",
    });
    return token;
  }
};

export const verifyJwt = async (req: NextApiRequest) => {
  const token: string | undefined = req?.cookies?.token;
  // console.log(`Token: ${token}`);

  try {
    // const verifiedToken = verify(
    //   token as string,
    //   process.env.JWT_SECRET as string
    // );

    const verifiedToken = verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as JwtPayload & { role: string; id: string };

    return { verifiedToken };
  } catch (error) {
    return { error };
  }
};
