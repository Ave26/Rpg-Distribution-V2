import { fetchAssignedProducts } from "@/fetcher/fetchAssignedProducts";
import useSWR from "swr";

export default function useBins() {
  const { data, error, isLoading } = useSWR(
    "/api/inventory/assigned-products/find",
    fetchAssignedProducts,
    {
      refreshInterval: 1200,
    }
  );
  return {
    assignedProducts: data,
    isLoading,
    error,
  };
}
