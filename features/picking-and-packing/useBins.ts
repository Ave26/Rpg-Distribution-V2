import useSWR from "swr";
import { bins } from "@prisma/client";
import { TAssignedProducts } from "@/fetcher/fetchProducts";

export type TBins = bins & {
  _count: { assignedProducts: number };
  assignedProducts: TAssignedProducts[];
};

async function fetchBins(url: string): Promise<TBins[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export default function useBins(sku?: string) {
  const query = sku ? `/api/order/bin?sku=${sku}` : `/api/order/bin`;

  const { data, error, isLoading } = useSWR(query, fetchBins, {
    refreshInterval: 1200,
  });
  return {
    bins: data,
    isLoading,
    error,
  };
}
