// useLocations.js
import { bins } from "@prisma/client";

export async function fetchLocations(url: string): Promise<bins[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
