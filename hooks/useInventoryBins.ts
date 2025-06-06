// useTrucks.js
import { fetchInventoryBins } from "@/fetcher/fetchInventoryBins";
import { InventoryPage } from "@/pages/api/inventory/bins";
import useSWR from "swr";

export default function useInventoryBins(page: InventoryPage) {
  const query = page
    ? `/api/inventory/bins?category=${page.category}&rackName=${page.rackName}&row=${page.row}&shelfLevel=${page.shelfLevel}`
    : `/api/order/bins`;

  const { data, error, isLoading } = useSWR(
    `/api/inventory/bins?category=${page.category}&rackName=${page.rackName}&row=${page.row}&shelfLevel=${page.shelfLevel}`,
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
