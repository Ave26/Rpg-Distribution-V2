import { fetchProductLogStatus } from "@/fetcher/fetchProductLogStatus";
import useSWR from "swr";

export default function useProductLogStatus() {
  const { data, error, isLoading } = useSWR(
    "/api/logs/report/product-status",
    fetchProductLogStatus,
    {
      refreshInterval: 1200,
    }
  );
  return {
    status: data,
    isLoading,
    error,
  };
}
