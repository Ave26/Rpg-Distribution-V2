export type SlugType = "add-product" | "scan-product";

export function isValidSlug(value: string): value is SlugType {
  return ["add-product", "scan-product"].includes(value as SlugType);
}
