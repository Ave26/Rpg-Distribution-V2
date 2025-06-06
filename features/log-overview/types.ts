export type SlugType =
  | "order-queue"
  | "product-status"
  | "report"
  | "downloadable"
  | "duplicate-scans"
  | "delivery-logs";

export function isValidSlug(value: string): value is SlugType {
  return [
    "order-queue",
    "product-status",
    "report",
    "downloadable",
    "duplicate-scans",
    "delivery-logs",
  ].includes(value as SlugType);
}
