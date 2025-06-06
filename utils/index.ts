import { RecordWithOrderedProductsAndBins } from "@/components/log-overview/OrderQueue";

export function formatDate(date: Date) {
  return date ? new Date(date).toISOString().split("T")[0] : "";
}

export function getTotalProductQuantity(
  record: RecordWithOrderedProductsAndBins
) {
  return record.orderedProducts.reduce((acc, initial) => {
    return (
      acc +
      initial.binLocations.reduce((acc, bl) => {
        return acc + bl.quantity;
      }, 0)
    );
  }, 0);
}

export function totalPWeight(record: RecordWithOrderedProductsAndBins) {
  return record.orderedProducts.reduce((acc, p) => {
    return (
      acc +
      p.binLocations.reduce((acc, bl) => {
        const w = bl.stockKeepingUnit?.weight ?? 0;

        return acc + w;
      }, 0)
    );
  }, 0);
}

export function getLastProductStatus(record: RecordWithOrderedProductsAndBins) {
  return record.orderedProducts
    .at(-1)
    ?.binLocations.at(-1)
    ?.assignedProducts.map((ap) => {
      return ap.status;
    });
}
