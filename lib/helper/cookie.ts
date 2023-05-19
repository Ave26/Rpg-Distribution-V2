import { NextApiResponse } from "next";

export const createCookie = (token: string, response: NextApiResponse) => {
  return response.setHeader(
    "Set-Cookie",
    `token=${token}; Max-Age=${5 * 3600}; Path=/; HttpOnly; SameSite=strict`
  );
};

export const deleteCookie = (response: NextApiResponse) => {
  return response.setHeader(
    "Set-Cookie",
    `token=; Max-Age=0; Path=/; HttpOnly; SameSite=strict`
  );
};
