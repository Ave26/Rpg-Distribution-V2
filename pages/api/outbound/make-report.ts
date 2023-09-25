import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../authMiddleware";
import { EntriesTypes } from "@/types/binEntries";
import { JwtPayload } from "jsonwebtoken";
import { make_log_report, update_product_status } from "@/lib/prisma/report";
import { EntryType } from "perf_hooks";
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
    case "POST":
      try {
        let userId: string = "";
        if (verifiedToken && typeof verifiedToken === "object") {
          userId = verifiedToken.id;
        }

        const { error, orders } = await make_log_report(
          productEntry,
          formData,
          userId
        );

        return orders
          ? res.status(200).json({ message: "Report Created", orders })
          : res.status(500).json(error);
      } catch (error) {
        return console.log(error);
      }

    case "GET":
      try {
        return res.send("Report Created");
      } catch (error) {
        return console.log(error);
      }
    default:
      break;
  }
}

export default authMiddleware(handler);
