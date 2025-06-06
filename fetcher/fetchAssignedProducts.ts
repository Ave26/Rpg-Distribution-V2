import { AssignedProducts } from "@/pages/api/inventory/assigned-products/find";

export async function fetchAssignedProducts(
  url: string
): Promise<AssignedProducts[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
