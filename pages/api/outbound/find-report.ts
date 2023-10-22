import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { EntriesTypes } from "@/types/binEntries";
import { JwtPayload } from "jsonwebtoken";
import {
  getReport,
  make_log_report,
  update_product_status,
} from "@/lib/prisma/report";
import { TFormData } from "@/types/inputTypes";

type TBody = {
  productEntry: EntriesTypes[];
  formData: TFormData;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  verifiedToken: string | JwtPayload | undefined
) {
  const { productEntry, formData }: TBody = req.body;
  switch (req.method) {
    case "GET":
      try {
        const { reports, error } = await getReport();

        return res.send(reports);
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
