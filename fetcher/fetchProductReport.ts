// useLocations.js
import { records } from "@prisma/client";

export async function fetchProductReport(url: string): Promise<records[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
