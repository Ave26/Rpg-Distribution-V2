import { AssignedProducts } from "@/pages/api/inventory/assigned-products/find";
import { assignedProducts, damageBins } from "@prisma/client";

export type UserData = {
  username: string;
  count: number;
};

export async function fetchUserScanned(url: string): Promise<UserData[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
