export type SlugType = "take-order" | "sort-order";

export function isValidSlug(value: string): value is SlugType {
  return ["take-order", "sort-order"].includes(value as SlugType);
}
