import { categories } from "@prisma/client";

export type Categories = {
  id: string;
  category: string;
  count: number;
  rackNames: string[];
};

export async function fetchCategories(url: string): Promise<Categories[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
