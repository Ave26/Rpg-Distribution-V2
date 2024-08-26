// useProducts.js

export type Categories = {
  category: string;
  count: string;
};

export async function fetchDamageCategories(
  url: string
): Promise<Categories[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
