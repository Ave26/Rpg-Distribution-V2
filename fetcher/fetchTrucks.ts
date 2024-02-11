// useTrucks.js
import { trucks } from "@prisma/client";
import { TTrucks } from "@/components/PickingAndPackingRole/PickingAndPackingType";

export async function fetchTrucks(url: string): Promise<TTrucks[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
