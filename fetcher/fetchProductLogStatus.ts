// useLocations.js
import { product_status_log } from "@prisma/client";

export async function fetchProductLogStatus(
  url: string
): Promise<product_status_log[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
