import { NextApiResponse } from "next";

export const createCookie = (token: string, response: NextApiResponse) => {
  return response.setHeader(
    "Set-Cookie",
    `token=${token}; Max-Age=3600; Path=/; HttpOnly; SameSite=strict`
  );
};

export const deleteCookie = (response: NextApiResponse) => {
  return response.setHeader(
    "Set-Cookie",
    `token=; Max-Age=0; Path=/; HttpOnly; SameSite=strict`
  );

  // return response.setHeader(
  //   "Set-Cookie",
  //   `token=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  // );
};
