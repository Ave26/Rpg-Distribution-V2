import { InventoryBins } from "@/pages/api/inventory/bins/find";
import { bins, ProductStatus } from "@prisma/client";

export type Bins = {
  count: number;
  productName: string;
  id: string;
  row: number;
  shelfLevel: number;
  category: string;
  racksName: string;
  barcodeId: string;
  skuCode: string;
  dateInfo: { date: Date; type: "received" | "expiry" };
  quality: string;
  status: ProductStatus;
  purchaseOrder: string;
  POs: string[];
};

export async function fetchInventoryBins(
  url: string
): Promise<InventoryBins[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
