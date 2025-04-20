import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // I want the category, racks, bin row and bin shelf

  return res.json("hello");
}
