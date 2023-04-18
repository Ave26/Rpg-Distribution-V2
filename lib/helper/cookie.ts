import { NextApiResponse } from "next";

export const createCookie = (token: string, response: NextApiResponse) => {
  return response.setHeader(
    "Set-Cookie",
    `token=${token}; Max-Age=3600; Path=/; HttpOnly; SameSite=strict`
  );
};

export const deleteCooke = (res: NextApiResponse) => {};
