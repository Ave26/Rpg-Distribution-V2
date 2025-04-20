import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // I want the category, racks, bin row and bin shelf

  // this will re route the current link into exact link to enable

  return res.json("hello");
}
