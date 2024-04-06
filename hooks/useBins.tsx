import useSWR from "swr";
import { fetchBins } from "@/fetcher/fetchProducts";

export default function useBins() {
  const { data, error, isLoading } = useSWR(
    "/api/inventory/bins/find",
    fetchBins,
    {
      refreshInterval: 1200,
    }
  );
  return {
    bins: data,
    isLoading,
    error,
  };
}
