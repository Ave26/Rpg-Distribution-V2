import { OrderReport } from "@prisma/client";
import prisma from ".";
import { EntriesTypes } from "@/types/binEntries";

type TReport = {
  id: string;
  totalQuantity: number | null;
  productName: string | null;
  barcodeId: string | null;
  expiryDate: Date | null;
  sku: string | null;
  price: number | null;
  binId: string | null;
  usersId: string | null;
};

export async function make_log_report(
  orderReport: EntriesTypes[],
  userId: string
) {
  try {
    const { date } = setTime();
    const report = await prisma.orders.create({
      data: {
        clientName: "skwak",
        dateCreated: date,
        productOrdered: orderReport,
      },
    });
    console.log({ log: report });

    return { report };
  } catch (error) {
    return { error };
  }
}

function setTime() {
  let date = new Date();

  // Set the time component to zero
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  // Format the date without time zone offset in local time
  date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return { date };
}
