// useProducts.js
import { deliveryLogs, trucks } from "@prisma/client";

export type TDeliveryLogs = deliveryLogs & {
  trucks: trucks;
};

export async function fetchDeliveryLogs(
  url: string
): Promise<Record<string, TDeliveryLogs[]>> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
