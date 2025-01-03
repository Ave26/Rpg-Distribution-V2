import { binLogReport } from "@prisma/client";

export async function fetchBinLogReports(url: string): Promise<binLogReport[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
