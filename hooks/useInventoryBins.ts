// useTrucks.js
import { fetchInventoryBins } from "@/fetcher/fetchInventoryBins";
import { InventoryPage } from "@/pages/api/inventory/bins/find";
import useSWR from "swr";

export default function useInventoryBins(page: InventoryPage) {
  const { data, error, isLoading } = useSWR(
    `/api/inventory/bins/find?category=${page.category}&rackName=${page.rackName}`,
    fetchInventoryBins,
    {
      refreshInterval: 1200,
    }
  );
  return {
    inventory: data,
    isLoading,
    error,
  };
}
