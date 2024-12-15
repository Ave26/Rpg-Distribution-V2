// useProducts.js

export type DamageCategories = {
  category: string;
  count: number;
};

export async function fetchDamageCategories(
  url: string
): Promise<DamageCategories[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
